# Add PostgreSQL so WISHLIST-AI stops crashing

Your app needs a **PostgreSQL database service** (not just a volume). Follow these steps on Railway.

---

## Step 1: Add a PostgreSQL database service

1. On the **Architecture** view (where you see WISHLIST-AI and the volume icons), click the **"+ Create"** button (top right).
2. In the menu that opens, choose **Database** (or **Add service** → **Database**).
3. Select **PostgreSQL**.
4. Railway will create a **new service** (a new tile/card) — this is the actual PostgreSQL server. Wait until it shows **Running** (not "Deploying" or "Crashed").  
   - You might see a new card like **"Postgres"** or **"PostgreSQL"** on the canvas.  
   - The **postgres-volume** icon at the bottom is only storage; the new **PostgreSQL** service is what gives you `DATABASE_URL`.

---

## Step 2: Connect WISHLIST-AI to the database

1. Click your **WISHLIST-AI** service (the one that’s crashing).
2. Open the **Variables** tab (next to Deployments, Metrics, Settings).
3. Click **"+ New Variable"** or **"New Variable"**.
4. Choose **"Add a reference"** or **"Reference"** (not a raw value).
5. In the list, select the **PostgreSQL** service you just created (e.g. "Postgres" or the name Railway gave it).
6. Pick the variable **`DATABASE_URL`**.
7. Save. Railway will add something like `DATABASE_URL = ${{Postgres.DATABASE_URL}}` and will redeploy WISHLIST-AI.

---

## Step 3: Add other required variables (if not already set)

Still in **WISHLIST-AI** → **Variables**, make sure you have:

| Variable        | Value |
|-----------------|--------|
| **SECRET_KEY**  | Any long random string (e.g. 32+ characters). |
| **APP_ENV**     | `production` |
| **CORS_ORIGINS**| Your Vercel app URL, e.g. `https://wishlist-ai.vercel.app` (no trailing slash). |

Save again if you added or changed anything.

---

## Step 4: Check

1. Wait for **WISHLIST-AI** to redeploy (watch the Deployments tab).
2. When the deployment is **Success**, open:  
   **https://wishlist-ai-production.up.railway.app/health**  
   You should see: `{"status":"ok","db":"ok"}`.
3. Try **Register** on your Vercel app; it should work and the server should not crash.

---

## Summary

- **"+ Create"** → **Database** → **PostgreSQL** = add the real Postgres service (with `DATABASE_URL`).
- **WISHLIST-AI** → **Variables** → **New Variable** → **Add a reference** → choose the **PostgreSQL** service → **DATABASE_URL** = connect the app to the database.
- The **postgres-volume** icon is only a volume; the **PostgreSQL** service from "+ Create" is what the app needs.
