# Vercel Deployment Guide - Anonymous Whistleblower Platform

## Overview

This guide will help you deploy the MVP to Vercel (frontend) and a serverless backend platform.

## Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Vercel Serverless Functions OR Railway/Render
- **Database**: Neon/Supabase (PostgreSQL)

## Prerequisites

1. GitHub account
2. Vercel account (free tier works)
3. Neon or Supabase account for PostgreSQL

---

## Part 1: Database Setup (Neon - Recommended)

### Step 1: Create Neon Database

1. Go to https://neon.tech
2. Sign up/Login
3. Click "Create Project"
4. Name: `whistleblower-mvp`
5. Region: Choose closest to your users
6. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

### Step 2: Run Migrations

```bash
# Set your database URL
export DATABASE_URL="your-neon-connection-string"

# Run migrations
cd server
npm install
npx tsx src/scripts/migrate.ts
```

Or manually run the SQL from `server/migrations/001_initial_schema.sql` in Neon's SQL Editor.

---

## Part 2: Backend Deployment (Railway - Recommended)

### Why Railway over Vercel for Backend?
- Vercel serverless functions have cold starts
- Railway provides always-on Node.js server
- Better for WebSocket/real-time features later

### Step 1: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `server` folder as root directory

### Step 2: Configure Environment Variables

In Railway dashboard, add these variables:

```env
NODE_ENV=production
PORT=3000

# Database (from Neon)
DATABASE_URL=your-neon-connection-string

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (will update after frontend deployment)
CORS_ORIGIN=https://your-frontend-url.vercel.app

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Step 3: Deploy

Railway will auto-deploy. Copy your backend URL (e.g., `https://your-app.railway.app`)

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - MVP ready"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/whistleblower-mvp.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Environment Variables

Add in Vercel dashboard:

```env
VITE_API_URL=https://your-backend.railway.app
```

### Step 4: Deploy

Click "Deploy" - Vercel will build and deploy your frontend.

---

## Part 4: Update CORS

After frontend is deployed:

1. Copy your Vercel URL (e.g., `https://whistleblower-mvp.vercel.app`)
2. Go back to Railway dashboard
3. Update `CORS_ORIGIN` environment variable to your Vercel URL
4. Railway will auto-redeploy

---

## Alternative: All-in-One Vercel Deployment

If you want to deploy everything on Vercel:

### Backend as Serverless Function

1. Update `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

2. Build before deploying:
```bash
cd server
npm run build
```

3. Deploy server to Vercel separately
4. Use the Vercel backend URL in frontend env

---

## Part 5: Post-Deployment Checklist

### Test the Deployment

1. ✅ Visit your Vercel frontend URL
2. ✅ Register a new user
3. ✅ Create a post
4. ✅ Vote on posts
5. ✅ Add comments
6. ✅ Check responsive design on mobile

### Monitor

- **Frontend**: Vercel Dashboard → Analytics
- **Backend**: Railway Dashboard → Metrics
- **Database**: Neon Dashboard → Monitoring

### Set Up Custom Domain (Optional)

#### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

#### Railway (Backend)
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

---

## Environment Variables Reference

### Backend (.env)

```env
# Required
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=min-32-characters-random-string
JWT_REFRESH_SECRET=min-32-characters-random-string
CORS_ORIGIN=https://your-frontend.vercel.app

# Optional
PORT=3000
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend.railway.app
```

---

## Troubleshooting

### Frontend Issues

**Build fails on Vercel**
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

**API calls fail**
- Verify VITE_API_URL is set correctly
- Check browser console for CORS errors
- Ensure backend is running

### Backend Issues

**Database connection fails**
- Verify DATABASE_URL is correct
- Check Neon database is active
- Ensure IP whitelist allows Railway

**CORS errors**
- Update CORS_ORIGIN to match frontend URL
- Include protocol (https://)
- No trailing slash

**Cold starts (Vercel)**
- Consider using Railway instead
- Or implement keep-alive ping

---

## Cost Estimate (Free Tier)

- **Vercel**: Free (100GB bandwidth, unlimited requests)
- **Railway**: Free $5/month credit (enough for MVP)
- **Neon**: Free (3GB storage, 1 project)

**Total**: $0/month for MVP testing

---

## Security Checklist

Before going live:

- [ ] Change all JWT secrets to strong random strings
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Review CORS settings
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerts
- [ ] Review database access controls
- [ ] Add input sanitization (DOMPurify)
- [ ] Set up error tracking (Sentry)

---

## Next Steps After Deployment

1. **Test thoroughly** with real users
2. **Gather feedback** on UX and features
3. **Monitor performance** and errors
4. **Iterate** based on user needs
5. **Add features** from remaining tasks:
   - File uploads
   - User profiles
   - Search
   - Content reporting
   - Admin dashboard

---

## Quick Deploy Commands

```bash
# Frontend
cd client
vercel

# Backend (if using Vercel)
cd server
npm run build
vercel

# Or use Railway CLI
cd server
railway up
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Fastify Docs**: https://www.fastify.io/docs

---

## Success Criteria

Your deployment is successful when:

✅ Frontend loads at your Vercel URL
✅ Users can register and login
✅ Posts can be created and viewed
✅ Voting works
✅ Comments can be added
✅ No console errors
✅ Mobile responsive
✅ HTTPS enabled

---

**Deployment Status**: Ready to deploy! 🚀

Follow the steps above to get your MVP live in ~30 minutes.
