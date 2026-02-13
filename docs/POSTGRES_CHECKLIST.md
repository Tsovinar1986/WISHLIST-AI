# PostgreSQL checklist — do this so login works

Do these steps **in order** on Railway. After this, WISHLIST-AI will stay up and login/register will work.

---

## ☐ 1. Create the PostgreSQL database

- Click **"+ Create"** (top right on the Architecture view).
- Click **"Database"** (or open the menu and choose Database).
- Select **"PostgreSQL"**.
- Wait until a **new service** appears (e.g. "Postgres" or "PostgreSQL") and its status is **Running**.

*(The "postgres-volume" and "mysql-volume" at the bottom are only storage; you need the **PostgreSQL** service from + Create.)*

---

## ☐ 2. Link DATABASE_URL to WISHLIST-AI

- Click the **WISHLIST-AI** service (the red/crashed one).
- Open the **Variables** tab.
- Click **"+ New Variable"** or **"New Variable"**.
- Choose **"Add a reference"** (or "Reference").
- Select the **PostgreSQL** service you created in step 1.
- Choose the variable **DATABASE_URL**.
- Save. Railway will redeploy WISHLIST-AI.

---

## ☐ 3. Set other variables on WISHLIST-AI

Still in **WISHLIST-AI** → **Variables**. Add these if they are missing:

| Variable        | Value |
|-----------------|--------|
| **SECRET_KEY**  | Any long random string (e.g. `my-super-secret-key-32-chars-long`) |
| **APP_ENV**     | `production` |
| **CORS_ORIGINS**| Your Vercel app URL, e.g. `https://wishlist-ai.vercel.app` (no trailing slash) |

Save again.

---

## ☐ 4. Wait and test

- Go to **WISHLIST-AI** → **Deployments**. Wait until the latest deployment is **Success** (not Crashed).
- Open in the browser: **https://wishlist-ai-production.up.railway.app/health**  
  You should see: `{"status":"ok","db":"ok"}`.
- Open your **Vercel app** (e.g. wishlist-ai.vercel.app) and try **Register** or **Login**. You should see the dashboard and your data as in the project.

---

**Done.** After step 4, login will show what you want and the server will not crash.
