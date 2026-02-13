# How to Add Environment Variables in Vercel

When you change env vars locally (in `Frontend/.env.local`), add or update the same variables in Vercel so the deployed app stays in sync.

---

## Steps in Vercel

1. Open [vercel.com](https://vercel.com) → your project (Wishlist-AI frontend).
2. Go to **Settings** → **Environment Variables**.
3. For each row in the table below:
   - Click **Add New** (or edit if it already exists).
   - **Key** = variable name (e.g. `NEXT_PUBLIC_API_URL`).
   - **Value** = same value as in your `.env.local` (or the production value from the table).
   - Choose **Environments**: Production (and optionally Preview, Development).
4. Click **Save**.
5. **Redeploy** the app (Deployments → ⋮ on latest → Redeploy) so the new variables are applied.

---

## Variables table (copy from here into Vercel)

| Variable name | Where to get / set | Description |
|---------------|--------------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Copy from `Frontend/.env.local` | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Copy from `Frontend/.env.local` | Supabase anon key (public). |
| `SUPABASE_SERVICE_ROLE_KEY` | Copy from `Frontend/.env.local` | Supabase service role key (secret, server-only). |
| `NEXT_PUBLIC_SITE_URL` | Set to your Vercel app URL, e.g. `https://your-app.vercel.app` | Frontend origin (for auth redirects). |
| `NEXT_PUBLIC_API_URL` | Set to backend URL, e.g. `https://wishlist-ai-production.up.railway.app` | Backend API base URL (no trailing slash). |
| `NEXT_PUBLIC_PUSHER_KEY` | Copy from `Frontend/.env.local` | Pusher key (public). |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Copy from `Frontend/.env.local` | Pusher cluster (e.g. `ap2`). |
| `GROQ_API_KEY` | Copy from `Frontend/.env.local` (if you use it) | Optional; server-only. |
| `OPENAI_API_KEY` | Copy from `Frontend/.env.local` (if you use it) | Optional; server-only. |

---

## When you change something

- **Changed a value in `.env.local`** → In Vercel, open **Settings → Environment Variables**, find that variable, edit the value, Save, then **Redeploy**.
- **Added a new variable in `.env.local`** → In Vercel, add a new row with the same key and value, then **Redeploy**.
- **Renamed or removed a variable** → In Vercel, delete or rename it in Environment Variables, then **Redeploy**.

---

## Quick checklist

- [ ] All variables from the table above are added in Vercel.
- [ ] `NEXT_PUBLIC_SITE_URL` is your real Vercel URL (e.g. `https://wishlist-ai-xxx.vercel.app`).
- [ ] `NEXT_PUBLIC_API_URL` is your Railway backend URL (no trailing slash).
- [ ] After editing env vars, a new deployment was triggered (or you clicked Redeploy).
