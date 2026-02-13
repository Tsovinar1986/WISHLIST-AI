# How to run locally (VS Code) and deploy on Vercel

## Running in VS Code (local)

### Prerequisites

- **Node.js** (for Frontend)
- **Python 3.11+** (for Backend)
- **PostgreSQL** (local or Docker)
- **VS Code** (optional; same steps work in any terminal)

### 1. Clone and install

```bash
cd Wishlist-AI
# Backend
cd Backend && python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Frontend
cd Frontend && npm install && cd ..
```

### 2. Environment files

**Backend** — in `Backend/` create `.env` (see `Backend/.env.example`):

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/wishlist_ai
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
# Optional: PUSHER_*, PUSHOVER_APP_TOKEN
```

**Frontend** — in `Frontend/` create `.env.local` (copy from `Frontend/.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Optional: NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER
```

### 3. Database

Start PostgreSQL (e.g. Docker):

```bash
docker run -d --name wishlist-db -e POSTGRES_USER=wishlist -e POSTGRES_PASSWORD=wishlist -e POSTGRES_DB=wishlist_ai -p 5432:5432 postgres:16-alpine
```

Create tables (from repo root):

```bash
cd Backend && source .venv/bin/activate && python -m scripts.init_db && cd ..
```

(If you don’t have `scripts.init_db`, use your migration tool or create tables manually.)

### 4. Run Backend and Frontend in VS Code

**Option A: Two terminals in VS Code**

1. **Terminal 1 — Backend**  
   - Open integrated terminal (`Ctrl+`` or `Cmd+``).  
   - Run:
   ```bash
   cd Backend && source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   - Backend: http://localhost:8000  
   - API docs: http://localhost:8000/docs  

2. **Terminal 2 — Frontend**  
   - Split terminal or new terminal (`+` in terminal panel).  
   - Run:
   ```bash
   cd Frontend && npm run dev
   ```
   - Frontend: http://localhost:3000  

**Option B: VS Code tasks (optional)**

Create `.vscode/tasks.json` to run both with “Run Task”:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Backend",
      "type": "shell",
      "command": "cd Backend && source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Frontend",
      "type": "shell",
      "command": "cd Frontend && npm run dev",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Run all",
      "dependsOn": ["Backend", "Frontend"]
    }
  ]
}
```

Then: **Terminal → Run Task… → Run all** (or run Backend and Frontend tasks separately).

### 5. After making changes

| What you changed              | What to do |
|------------------------------|------------|
| **Backend Python code**      | Save file; `uvicorn --reload` will restart the backend automatically. |
| **Backend `.env` or deps**   | Restart the Backend terminal (stop with `Ctrl+C`, run the uvicorn command again). If you added a new package: `pip install -r requirements.txt` then restart. |
| **Frontend React/TS code**   | Save file; Next.js dev server will hot-reload. |
| **Frontend `.env.local`**    | Restart the Frontend dev server (`Ctrl+C`, then `npm run dev` again). |
| **Frontend dependencies**    | Run `npm install` (or `npm install <pkg>`), then restart `npm run dev`. |

---

## Deploying on Vercel (Frontend)

The **Frontend** (Next.js) is deployed on Vercel. The **Backend** (FastAPI) must be hosted elsewhere (e.g. Railway, Render, Fly.io) and its URL is set in the frontend env.

### 1. Connect repo to Vercel

1. Push your code to GitHub (or GitLab/Bitbucket).  
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.  
3. Set **Root Directory** to `Frontend`.  
4. Leave **Framework Preset** as Next.js.  
5. **Build Command:** `npm run build` (default).  
6. **Output Directory:** `.next` (default).  
7. Deploy.

### 2. Environment variables on Vercel

In the Vercel project: **Settings → Environment Variables**. Add at least:

| Name                     | Value                    | Notes |
|--------------------------|--------------------------|--------|
| `NEXT_PUBLIC_API_URL`    | `https://your-backend.com` | Backend API URL (no trailing slash). **Required.** |
| `NEXT_PUBLIC_SITE_URL`   | `https://your-app.vercel.app` | Your Vercel app URL (for links). Optional. |
| `NEXT_PUBLIC_PUSHER_KEY` | (Pusher key)             | Only if you use Pusher. |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | `ap2`                | Only if you use Pusher. |

- Use the **same** names and values for **Production**, **Preview**, and **Development** if you want one backend for all.  
- After adding or changing env vars, **redeploy** (Deployments → … → Redeploy).

### 3. After making changes (Vercel)

- **Push to the branch** Vercel is watching (usually `main`).  
- Vercel will run a new build and deploy.  
- If you only changed **env vars**, go to **Deployments → … → Redeploy** (no code push needed).

### 4. Backend (not on Vercel)

- Host the FastAPI app (e.g. Railway, Render) and set its **CORS** to allow your Vercel domain, e.g. `https://your-app.vercel.app`.  
- In Backend `.env` (on the host):  
  `CORS_ORIGINS=https://your-app.vercel.app`  
- Use the same `SECRET_KEY` and `DATABASE_URL` you use in production.

---

## Quick reference

| Action              | Local (VS Code)                          | Vercel (Frontend)          |
|---------------------|------------------------------------------|-----------------------------|
| Run backend         | `cd Backend && uvicorn app.main:app --reload --port 8000` | N/A (use another host)     |
| Run frontend        | `cd Frontend && npm run dev`             | Automatic on push           |
| Restart after .env  | Restart the corresponding terminal      | Redeploy or change env + Redeploy |
| Build frontend      | `cd Frontend && npm run build`           | Automatic on deploy         |
