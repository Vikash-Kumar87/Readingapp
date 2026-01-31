# 🔧 Session & CORS Fix for Production

## Problem
- Admin dashboard showing all 0s
- Session expired error when editing teachers
- Login required repeatedly

## Root Cause
Session cookies were not being sent properly between frontend (Vercel) and backend (Render) due to:
1. Incorrect cookie settings for cross-origin requests
2. CORS not allowing credentials properly

## Changes Made

### 1. Session Configuration (`server/server.js`)
```javascript
cookie: {
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}
```

**Key Points:**
- `secure: true` in production → cookies only sent over HTTPS
- `sameSite: 'none'` in production → allows cross-site cookies (Vercel ↔ Render)
- `sameSite: 'lax'` in development → works with localhost

### 2. CORS Configuration (`server/server.js`)
```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Allow Vercel deployments
    if (origin && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    // Allow Render URLs
    if (origin && origin.includes('onrender.com')) {
      return callback(null, true);
    }
    // Allow localhost
    // ...rest of logic
  },
  credentials: true, // CRITICAL: Must be true for cookies
  // ...
}));
```

## Deployment Steps

### Step 1: Verify Render Environment Variables
Go to Render Dashboard → readingapp-backend → Environment

**CRITICAL:** Make sure these are set:
```
NODE_ENV=production
FRONTEND_URL=https://readingapp-sigma.vercel.app
SESSION_SECRET=session_secret_key_readingapp_2026_vikash_secure
```

### Step 2: Push Changes to GitHub
```bash
git add .
git commit -m "Fix session and CORS for production"
git push origin main
```

### Step 3: Redeploy Render
- Render will auto-deploy from GitHub
- OR manually click "Deploy latest commit"

### Step 4: Clear Browser Cache
After deployment:
1. Open browser DevTools (F12)
2. Go to Application → Storage
3. Click "Clear site data"
4. Refresh page
5. Login again

## Testing Checklist

### ✅ Backend Health
```bash
curl https://readingapp-backend-xxxx.onrender.com/api/health
```
Should return: `{"success":true,"message":"Server is running"}`

### ✅ Analytics Endpoint
```bash
curl https://readingapp-backend-xxxx.onrender.com/api/analytics/admin \
  -H "Cookie: connect.sid=YOUR_SESSION_ID" \
  --cookie-jar cookies.txt
```

### ✅ Frontend
1. Login to admin panel
2. Check Dashboard → should show actual counts (not 0)
3. Go to Manage Teachers → Edit a teacher → Should work without session expiry

## Common Issues

### Issue: Still showing "Session expired"
**Solution:** 
1. Check browser console for CORS errors
2. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
3. Clear cookies and login again

### Issue: Dashboard still showing 0s
**Solution:**
1. Check Render logs: Dashboard → Logs
2. Look for "Error fetching analytics" or CORS blocked messages
3. Verify MongoDB connection is working

### Issue: "Cross-Origin Request Blocked"
**Solution:**
1. Check that `credentials: true` is in CORS config
2. Check that `sameSite: 'none'` when `NODE_ENV=production`
3. Verify backend is using HTTPS (Render provides this by default)

## Why This Works

### Development (localhost:5173 ↔ localhost:5000)
- Same origin (localhost)
- `sameSite: 'lax'` works fine
- `secure: false` allows HTTP cookies

### Production (vercel.app ↔ onrender.com)
- Different origins (cross-site)
- `sameSite: 'none'` required for cross-site cookies
- `secure: true` required (HTTPS only)
- CORS must explicitly allow origin and credentials

## Environment-Specific Behavior

| Setting | Development | Production |
|---------|-------------|------------|
| cookie.secure | false | true |
| cookie.sameSite | 'lax' | 'none' |
| CORS origin | localhost:* | vercel.app, onrender.com |
| Protocol | HTTP | HTTPS |

## References
- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [CORS with credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
