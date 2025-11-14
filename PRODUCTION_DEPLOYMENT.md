# Production Deployment Guide

This guide covers deploying the Anonymous Whistleblower Platform to production environments.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option 1: Deploy to Railway (Recommended)

Railway provides easy PostgreSQL integration and automatic deployments.

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create a database

4. **Configure Backend Service**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory to `server`

5. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

6. **Configure Build Settings**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

7. **Run Migrations**
   - After first deployment, run migrations via Railway CLI:
   ```bash
   railway run npm run migrate
   ```

8. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Save this for frontend configuration

---

### Option 2: Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Choose free tier or paid plan
   - Save the Internal Database URL

3. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `whistleblower-api`
     - Root Directory: `server`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

5. **Run Migrations**
   - Use Render Shell to run: `npm run migrate`

---

### Option 3: Deploy to DigitalOcean App Platform

1. **Create DigitalOcean Account**
   - Go to https://www.digitalocean.com
   - Sign up and add payment method

2. **Create Managed PostgreSQL Database**
   - Create → Databases → PostgreSQL
   - Choose plan and region
   - Save connection details

3. **Create App**
   - Apps → Create App
   - Connect GitHub repository
   - Select `server` directory

4. **Configure App**
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000

5. **Add Environment Variables** (same as above)

6. **Deploy and Run Migrations**

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is optimized for React/Vite applications.

#### Steps:

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Dashboard → "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://your-app.vercel.app`

6. **Update Backend CORS**
   - Go back to your backend deployment
   - Update `CORS_ORIGIN` environment variable with your Vercel URL
   - Redeploy backend

7. **Custom Domain (Optional)**
   - In Vercel project settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

---

### Option 2: Deploy to Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Import Project**
   - Sites → "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Configure Build Settings**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy site"
   - Update backend CORS with Netlify URL

---

### Option 3: Deploy to Cloudflare Pages

1. **Create Cloudflare Account**
   - Go to https://pages.cloudflare.com
   - Sign up

2. **Create Pages Project**
   - Connect GitHub repository
   - Configure:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Root directory: `client`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy and Update CORS**

---

## Database Setup

### PostgreSQL Configuration

1. **Create Database**
   - Use your hosting provider's PostgreSQL service
   - Note the connection URL

2. **Run Migrations**
   ```bash
   # Set DATABASE_URL environment variable
   export DATABASE_URL="postgresql://user:password@host:5432/dbname"
   
   # Run migrations
   cd server
   npm run migrate
   ```

3. **Verify Database**
   - Check that all tables are created:
     - users
     - posts
     - comments
     - votes
     - communities
     - post_tags
     - tags
     - user_sessions

---

## Environment Configuration

### Backend Environment Variables

**Required:**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<64-character-random-string>
JWT_REFRESH_SECRET=<64-character-random-string>
CORS_ORIGIN=https://your-frontend-domain.com
```

**Optional:**
```bash
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Frontend Environment Variables

```bash
VITE_API_URL=https://your-backend-domain.com
```

### Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# For JWT secrets (64 characters)
openssl rand -base64 48

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

---

## Post-Deployment

### 1. Verify Deployment

**Backend Health Check:**
```bash
curl https://your-backend-url.com/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Test API Endpoints:**
```bash
# Test registration
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","passphrase":"testpass123"}'
```

**Frontend Check:**
- Visit your frontend URL
- Try registering an account
- Create a test post
- Test voting and commenting

### 2. Monitor Application

**Backend Monitoring:**
- Check server logs for errors
- Monitor database connections
- Track API response times
- Set up error alerting

**Frontend Monitoring:**
- Check browser console for errors
- Monitor page load times
- Test on different devices/browsers

### 3. Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] Strong JWT secrets configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Database credentials secured
- [ ] Environment variables not exposed in code
- [ ] SQL injection protection verified
- [ ] XSS protection enabled

### 4. Performance Optimization

**Backend:**
- Enable database connection pooling
- Add Redis for session management (optional)
- Enable gzip compression
- Set up CDN for static assets

**Frontend:**
- Enable Vercel/Netlify CDN
- Optimize images
- Enable code splitting
- Add service worker for offline support

### 5. Backup Strategy

**Database Backups:**
- Enable automatic backups on your database host
- Test restore procedures
- Keep at least 7 days of backups

**Code Backups:**
- Ensure GitHub repository is up to date
- Tag releases for easy rollback

---

## Troubleshooting

### Backend Issues

**Database Connection Failed:**
```bash
# Check DATABASE_URL format
# Should be: postgresql://user:password@host:5432/dbname

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**CORS Errors:**
- Verify CORS_ORIGIN matches your frontend URL exactly
- Include protocol (https://)
- No trailing slash

**Server Won't Start:**
- Check all required environment variables are set
- Verify Node.js version (should be 18+)
- Check logs for specific errors

### Frontend Issues

**API Connection Failed:**
- Verify VITE_API_URL is correct
- Check backend CORS configuration
- Verify backend is running and accessible

**Build Failures:**
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

**White Screen:**
- Check browser console for errors
- Verify environment variables are set
- Hard refresh browser (Cmd+Shift+R)

---

## Continuous Deployment

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build**
   - Vercel/Railway detect the push
   - Automatically build and deploy
   - Run health checks

3. **Rollback if Needed**
   - Both platforms support instant rollback
   - Use dashboard to revert to previous deployment

---

## Cost Estimates

### Free Tier Options

**Backend (Railway):**
- Free: $5 credit/month
- Hobby: $5/month

**Frontend (Vercel):**
- Free: Unlimited personal projects
- Pro: $20/month for teams

**Database (Railway PostgreSQL):**
- Included in Railway free tier
- Paid: ~$5-10/month for production

**Total Free Tier:** $0/month (with limitations)
**Total Paid Tier:** ~$15-30/month

---

## Support

For deployment issues:
1. Check platform documentation
2. Review application logs
3. Test locally first
4. Check GitHub issues

---

## Quick Start Commands

```bash
# Generate secrets
openssl rand -base64 48

# Test backend locally
cd server
npm install
npm run dev

# Test frontend locally
cd client
npm install
npm run dev

# Build for production
cd server && npm run build
cd client && npm run build
```

---

**Last Updated:** November 2025
**Platform Version:** 1.0.0
