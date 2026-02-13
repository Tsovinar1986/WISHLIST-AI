# Vercel + Railway: env vars so frontend and backend work together

Use these values so the **Vercel** frontend talks to the **Railway** backend.

---

## 1. Vercel (Frontend) — Environment Variables

**Where:** Vercel → your project → **Settings** → **Environment Variables**

Add these (Production + Preview if you want):

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://wishlist-backend.up.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR_VERCEL_APP.vercel.app` *(replace with your real Vercel app URL)* |

Then **Redeploy** (Deployments → ⋯ → Redeploy).

---

## 2. Railway (Backend) — Environment Variables

**Where:** Railway → your backend service → **Variables**

Add or set:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | `postgresql+asyncpg://...` *(from Railway PostgreSQL or your DB)* |
| `SECRET_KEY` | *(long random string for JWT)* |
| `APP_ENV` | `production` |
| `CORS_ORIGINS` | `https://YOUR_VERCEL_APP.vercel.app` *(your Vercel frontend URL; no trailing slash)* |

Optional (if you use them):

- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
- `PUSHOVER_APP_TOKEN`

**Important:** Do **not** put Railway API tokens (e.g. for deploy) in these variables. Use them only in Railway dashboard or CLI for deployment. The UUID you have is for Railway auth — keep it secret and never add it as `NEXT_PUBLIC_*` or commit it.

---

## 3. One-time checklist

- [ ] **Railway:** Backend deployed; Variables set (especially `DATABASE_URL`, `SECRET_KEY`, `APP_ENV=production`, `CORS_ORIGINS` = your Vercel URL).
- [ ] **Vercel:** `NEXT_PUBLIC_API_URL` = `https://wishlist-backend.up.railway.app` and `NEXT_PUBLIC_SITE_URL` = your Vercel app URL.
- [ ] **Redeploy** both after changing env (Railway redeploys on save; Vercel → Redeploy).

After this, the server part (backend on Railway + frontend on Vercel) works together.
