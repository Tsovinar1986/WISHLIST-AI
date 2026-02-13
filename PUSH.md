# How to put everything on GitHub

Follow **one** of the methods below. Use **Method 1** first; if the terminal keeps asking for password and it fails, use **Method 2**.

---

## Method 1: Push with token (terminal will ask once)

1. Open **Terminal** (not Cursor’s terminal if it causes issues — use **macOS Terminal** or **iTerm**).

2. Go to the project folder:
   ```bash
   cd /Users/tsovinarbabakhanyan/Desktop/Wishlist-ai
   ```

3. Make sure the remote is HTTPS:
   ```bash
   git remote set-url origin https://github.com/Tsovinar1986/Wishlist-AI.git
   ```

4. Push (Git will ask for username and password):
   ```bash
   git push origin main --force
   ```
   - **Username:** `Tsovinar1986`
   - **Password:** paste your **GitHub token** (the one that starts with `ghp_`). You won’t see it as you paste — that’s normal. Press Enter.

5. If it works, from now on you can use:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

---

## Method 2: Token in URL (one-time, usually works when Method 1 doesn’t)

This uses the token directly in the remote URL so Git doesn’t need to prompt.

1. Open **Terminal** and run (replace `YOUR_TOKEN` with your real token):
   ```bash
   cd /Users/tsovinarbabakhanyan/Desktop/Wishlist-ai
   git remote set-url origin https://Tsovinar1986:YOUR_TOKEN@github.com/Tsovinar1986/Wishlist-AI.git
   git push origin main --force
   ```
   Example (fake token):  
   `git remote set-url origin https://Tsovinar1986:ghp_xxxxxxxxxxxx@github.com/Tsovinar1986/Wishlist-AI.git`

2. After a successful push, **remove the token from the URL** so it isn’t stored:
   ```bash
   git remote set-url origin https://github.com/Tsovinar1986/Wishlist-AI.git
   ```

3. **Revoke this token** on GitHub and create a new one for future use:  
   https://github.com/settings/tokens

---

## Method 3: GitHub Desktop (no terminal)

1. Download **GitHub Desktop**: https://desktop.github.com/
2. Sign in with your GitHub account.
3. **File → Add Local Repository** → choose folder:  
   `/Users/tsovinarbabakhanyan/Desktop/Wishlist-ai`
4. If it says “this isn’t a Git repository”, open **Terminal** and run:
   ```bash
   cd /Users/tsovinarbabakhanyan/Desktop/Wishlist-ai
   git init
   git remote add origin https://github.com/Tsovinar1986/Wishlist-AI.git
   ```
   Then in GitHub Desktop: **Repository → Add** again and select that folder.
5. You should see your commits. Click **Push origin** (or **Publish** if it’s the first time). Sign in with GitHub when asked.

---

## What gets pushed

- **Backend** (FastAPI, app, models, scripts)
- **Frontend** (Next.js, app, components, `src/`)
- **Config** (`docker-compose.yml`, `.gitignore`, `README.md`)

**Not pushed** (they’re in `.gitignore`):

- `node_modules/` and `Frontend/.next/` (too large; run `npm install` after clone)
- `.env` and `.env.local` (secrets)

After someone clones the repo, they run `npm install` in `Frontend/` and `pip install -r requirements.txt` in `Backend/`.

---

## If you get errors

| Error | What to do |
|-------|------------|
| `Permission denied` or `Authentication failed` | Use **Method 2** with a new token (scope: **repo**). |
| `Support for password authentication was removed` | You must use a **token**, not your GitHub password. Create one: https://github.com/settings/tokens (classic, **repo**). |
| `failed to push some refs` or `rejected` | Run: `git push origin main --force` (only if you’re sure you want to overwrite the remote branch). |
| `Repository not found` | Check: repo exists at https://github.com/Tsovinar1986/Wishlist-AI and your token has **repo** access. |
