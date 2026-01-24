# 🚀 Deployment Guide - Reading App

## Backend Deployment (Render)

### Step 1: Create Web Service on Render
1. Go to [render.com](https://render.com) and login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Vikash-Kumar87/Readingapp`

### Step 2: Configure Service
- **Name:** `readingapp-backend`
- **Region:** Oregon (US West)
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### Step 3: Add Environment Variables
Click on "Environment" tab and add these variables:

```env
MONGODB_URI=mongodb+srv://deepakkr1462006:vikashkr206@cluster0.e3oqnh8.mongodb.net/readingapp?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=readingapp_super_secret_key_2026_production_vikash_kumar_87_minimum_32_characters

SESSION_SECRET=session_secret_key_readingapp_2026_vikash_secure

NODE_ENV=production

PORT=5000

FRONTEND_URL=https://your-app-name.vercel.app
```

**Note:** Update `FRONTEND_URL` after Vercel deployment

### Step 4: Deploy
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Copy your backend URL: `https://readingapp-backend-xxxx.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Update Environment Variable
After backend is deployed, update `.env`:
```env
VITE_API_URL=https://readingapp-backend-xxxx.onrender.com
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and login
2. Click **"Add New"** → **"Project"**
3. Import GitHub repository: `Vikash-Kumar87/Readingapp`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

### Step 3: Add Environment Variable
In Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Add: `VITE_API_URL` = `https://readingapp-backend-xxxx.onrender.com`

### Step 4: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Your app URL: `https://your-app-name.vercel.app`

### Step 5: Update Backend FRONTEND_URL
Go back to Render dashboard:
- Update `FRONTEND_URL` environment variable with your Vercel URL
- Redeploy the backend service

---

## 📝 Post-Deployment Checklist

- ✅ Backend deployed on Render
- ✅ Frontend deployed on Vercel
- ✅ Environment variables configured
- ✅ CORS updated with correct frontend URL
- ✅ Test login/register functionality
- ✅ Test file uploads
- ✅ Verify teacher notes are loading

---

## 🔍 Testing URLs

**Backend Health Check:**
```
https://readingapp-backend-xxxx.onrender.com/api/health
```

**Frontend:**
```
https://your-app-name.vercel.app
```

---

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Render free tier may spin down after 15 minutes of inactivity
   - First request after inactivity may take 30-60 seconds

2. **File Uploads:**
   - Current setup stores files locally (will be lost on Render's free tier restarts)
   - For production, consider using AWS S3, Cloudinary, or similar cloud storage

3. **Database:**
   - MongoDB Atlas free tier (512 MB)
   - Monitor usage in Atlas dashboard

---

## 🛠️ Troubleshooting

**Backend not responding:**
- Check Render logs
- Verify environment variables
- Check MongoDB connection

**Frontend API errors:**
- Verify VITE_API_URL is correct
- Check browser console for CORS errors
- Ensure backend FRONTEND_URL is updated

**CORS issues:**
- Make sure backend FRONTEND_URL matches your Vercel URL exactly
- Check if credentials are being sent properly

---

## 📞 Support

If you face any issues:
1. Check Render logs (Dashboard → Logs)
2. Check Vercel deployment logs
3. Test backend health endpoint
4. Verify all environment variables are set correctly
