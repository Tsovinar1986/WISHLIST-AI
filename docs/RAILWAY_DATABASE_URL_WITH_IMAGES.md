# Where to find DATABASE_URL for Railway (with visuals)

## Step-by-step diagram

![Railway DATABASE_URL setup steps](assets/railway-database-url-steps.png)

*Flow: Project → + New → PostgreSQL → then in WISHLIST-AI Variables add a reference to Postgres DATABASE_URL (or copy the URL from the Postgres service).*

---

## Railway’s own docs (real screenshots)

Railway’s docs show the real UI with screenshots:

1. **Add PostgreSQL**
   - [PostgreSQL on Railway](https://docs.railway.com/databases/postgresql) — “Deploy” section: use **+ New** → **Database** → **PostgreSQL**.

2. **Reference DATABASE_URL in your service**
   - [Referencing another service’s variable](https://docs.railway.com/variables#referencing-another-services-variable) — how to use **Add a reference** and pick the Postgres service’s **DATABASE_URL**.

3. **Variables tab**
   - In your **WISHLIST-AI** service, open **Variables**. You’ll see a list and a **New Variable** (or **+ Variable**) button. Use **Add a reference** and select the PostgreSQL service, then **DATABASE_URL**.

---

## Short text version

| Step | Where | What you see / do |
|------|--------|-------------------|
| 1 | Project canvas | **+ New** button (or “Add service”). |
| 2 | Menu | **Database** → **PostgreSQL**. |
| 3 | New tile | A new **PostgreSQL** service; wait until it’s **Running**. |
| 4 | Click **WISHLIST-AI** | Your backend service. |
| 5 | **Variables** tab | List of variables and **New Variable** (or **+ Variable**). |
| 6 | **New Variable** | Option like **“Add a reference”** or **“Reference”**. |
| 7 | Reference picker | List of services; choose your **PostgreSQL** service. |
| 8 | Variable picker | List of variables; choose **DATABASE_URL**. |
| 9 | Save | Railway fills in the URL and redeploys. |

---

## Copying the URL instead of referencing

1. Click the **PostgreSQL** service (its tile on the canvas).
2. Open the **Variables** tab (or **Connect**).
3. Find **DATABASE_URL** and copy its value.
4. Open **WISHLIST-AI** → **Variables** → **New Variable**.
5. Name: `DATABASE_URL`, Value: paste the URL → Save.
