# Wishlist Backend (FastAPI)

## Quick start (frontend on localhost:3000, backend on localhost:8000)

1. **Copy env and set database:**
   ```bash
   cp .env.example .env
   # Edit .env and set DATABASE_URL to your PostgreSQL URL (async: postgresql+asyncpg://...)
   ```

2. **Create DB and tables** (if using Alembic):
   ```bash
   # From repo root or Backend/
   alembic upgrade head
   # Or run scripts/init_db.py if you have a simple init script
   ```

3. **Run the API:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Check health:**
   - `GET http://localhost:8000/health` → `{"status":"ok"}`

5. **Auth:**
   - `POST http://localhost:8000/api/auth/register` — body: `{"email":"...","password":"...","name":"..."}`
   - `POST http://localhost:8000/api/auth/login` — body: `{"email":"...","password":"..."}` → returns `{"access_token":"...","refresh_token":"..."}`

CORS is set so that in development all origins (`*`) are allowed, so the frontend at `http://localhost:3000` can call the backend without "Load failed" errors.

## Pushover (push notifications)

Set `PUSHOVER_APP_TOKEN` in `.env` (create an app at https://pushover.net/apps/build). Users set their Pushover User Key in the dashboard; when someone reserves or contributes to a wishlist, the owner gets a push. If you already have a `users` table, add the column: `ALTER TABLE users ADD COLUMN IF NOT EXISTS pushover_user_key VARCHAR(64);`
