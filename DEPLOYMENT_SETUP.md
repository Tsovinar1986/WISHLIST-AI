# Deployment Setup Guide

## Fix "Load failed" Error

The "Load failed" error occurs because the frontend can't connect to the backend API. Follow these steps:

### 1. Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

**Frontend Environment Variables:**
- `NEXT_PUBLIC_API_URL` = Your backend API URL (e.g., `https://your-backend.railway.app`)
- `NEXT_PUBLIC_SITE_URL` = Your frontend URL (e.g., `https://wishlist-ai.vercel.app`)

**Important:** Select all environments (Production, Preview, Development) when adding these.

### 2. Update Backend CORS Configuration

Your backend needs to allow requests from your Vercel domain. Update the backend's `.env` file or environment variables:

**Backend Environment Variables:**
- `CORS_ORIGINS` = `http://localhost:3000,http://localhost:5173,https://your-app.vercel.app,https://*.vercel.app`

Or update `Backend/app/core/config.py` to include Vercel domains:

```python
cors_origins: str = "http://localhost:5173,http://localhost:3000,https://*.vercel.app"
```

### 3. Deploy Backend API

Make sure your backend is deployed and accessible. Options:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Fly.io**: https://fly.io
- **DigitalOcean**: https://digitalocean.com

### 4. Verify Configuration

After setting environment variables:
1. **Redeploy** your Vercel frontend (trigger a new deployment)
2. **Redeploy** your backend with updated CORS settings
3. Check browser console (F12) for detailed error messages

### 5. Test the Connection

Open browser console (F12) and check:
- Network tab: Look for failed requests to `/api/auth/login` or `/api/auth/register`
- Console tab: Check for CORS errors or connection errors

## Common Issues

### Issue: "Cannot connect to server"
**Solution:** Make sure `NEXT_PUBLIC_API_URL` is set in Vercel and points to your deployed backend.

### Issue: CORS error in browser console
**Solution:** Update backend `CORS_ORIGINS` to include your Vercel domain.

### Issue: Backend returns 404
**Solution:** Make sure backend routes are mounted at `/api` prefix (they should be).

## Quick Debug

Add this to your frontend temporarily to see what API URL is being used:

```typescript
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
```

This will help you verify the environment variable is being loaded correctly.
