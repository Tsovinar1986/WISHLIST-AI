# Why the Railway backend is crashing and how to fix it

## 1. See the real error (Logs)

In Railway: open your **WISHLIST-AI** service → **Logs** (or **Deployments** → click a deployment → **View Logs**).

Typical messages you might see:

- `Connect call failed ... 127.0.0.1 5432` or `connection refused` → **DATABASE_URL** is missing or still points to localhost.
- `ModuleNotFoundError` or `No module named` → build/dependency issue (wrong root directory or missing `requirements.txt`).
- `Address already in use` or port error → usually not the case if you use `${PORT}` (we do).

---

## 2. Fix: set DATABASE_URL (most common cause)

The app needs a **PostgreSQL** database. If **DATABASE_URL** is not set in Railway, it uses the default `localhost:5432`, which does not exist on Railway → the app crashes when it touches the DB.

### Do this

1. **Add PostgreSQL** (if you don’t have it yet)  
   In your Railway project: **+ New** → **Database** → **PostgreSQL**. Wait until it is **Running**.

2. **Set DATABASE_URL on the WISHLIST-AI service**  
   - Open **WISHLIST-AI** → **Variables**.  
   - **New Variable** → choose **Add a reference** (or **Reference**).  
   - Select the **PostgreSQL** service → variable **DATABASE_URL**.  
   - Save.  
   - Or: from the PostgreSQL service, open **Variables** (or **Connect**), copy **DATABASE_URL**, then in WISHLIST-AI → Variables add `DATABASE_URL` = that value.

3. **Redeploy**  
   **Deployments** → ⋮ on the latest deployment → **Redeploy** (or push a new commit).

Detailed steps with screenshots: [RAILWAY_DATABASE_URL_WITH_IMAGES.md](RAILWAY_DATABASE_URL_WITH_IMAGES.md).

---

## 3. Other variables to set (WISHLIST-AI → Variables)

| Variable        | Required | Example / note |
|----------------|----------|----------------|
| **DATABASE_URL** | ✅ Yes   | From PostgreSQL service (reference or paste). |
| **SECRET_KEY**   | ✅ Yes   | e.g. `437a1a09-b807-4be1-9225-588b21d541ec` (JWT signing). |
| **CORS_ORIGINS** | Optional | Your frontend URL, e.g. `https://your-app.vercel.app`. |
| **PORT**         | No       | Railway sets this automatically. |

---

## 4. Checklist

- [ ] PostgreSQL service exists and is **Running**.
- [ ] **WISHLIST-AI** → **Variables** has **DATABASE_URL** (from Postgres) and **SECRET_KEY**.
- [ ] Root directory for WISHLIST-AI is **Backend** (Settings → Source).
- [ ] After changing variables, you **Redeploy**ed (or triggered a new deployment).

After that, check **Logs** again; if it still crashes, the log line will point to the next cause (e.g. missing module, wrong Python version).
