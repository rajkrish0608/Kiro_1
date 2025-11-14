# Deployment Checklist

Use this checklist to ensure smooth deployment to Vercel.

## Pre-Deployment

### Code Preparation
- [x] All TypeScript errors resolved
- [x] All components implemented
- [x] API endpoints defined
- [x] Database schema created
- [x] Environment variables documented
- [x] vercel.json files created
- [x] README.md created
- [x] Deployment guide created

### Repository Setup
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Add .gitignore files
- [ ] Create main branch
- [ ] Tag MVP release

## Database Setup (Neon)

- [ ] Create Neon account
- [ ] Create new project
- [ ] Copy connection string
- [ ] Run migrations manually or via script
- [ ] Verify tables created
- [ ] Test connection

## Backend Deployment (Railway)

- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Select server folder as root
- [ ] Add environment variables:
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] CORS_ORIGIN (update after frontend)
- [ ] Deploy backend
- [ ] Copy backend URL
- [ ] Test health endpoint

## Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure project:
  - [ ] Root directory: client
  - [ ] Framework: Vite
  - [ ] Build command: npm run build
  - [ ] Output directory: dist
- [ ] Add environment variables:
  - [ ] VITE_API_URL (Railway backend URL)
- [ ] Deploy frontend
- [ ] Copy frontend URL

## Post-Deployment Configuration

- [ ] Update CORS_ORIGIN in Railway to Vercel URL
- [ ] Wait for Railway to redeploy
- [ ] Test CORS is working

## Testing

### Smoke Tests
- [ ] Frontend loads without errors
- [ ] Can access registration page
- [ ] Can access login page
- [ ] API health check responds

### User Flow Tests
- [ ] Register new user
  - [ ] Form validation works
  - [ ] Recovery key modal appears
  - [ ] Can copy recovery key
  - [ ] Redirects to feed
- [ ] Login
  - [ ] Can login with credentials
  - [ ] Token stored correctly
  - [ ] Redirects to feed
- [ ] Create post
  - [ ] Form loads
  - [ ] Can enter title and content
  - [ ] Can add tags
  - [ ] Post submits successfully
  - [ ] Redirects to feed
- [ ] View feed
  - [ ] Posts display
  - [ ] Can switch sorting (Recent/Trending/Top)
  - [ ] Infinite scroll works
- [ ] Vote on post
  - [ ] Upvote works
  - [ ] Downvote works
  - [ ] Can toggle vote
  - [ ] Score updates
- [ ] View post detail
  - [ ] Full post displays
  - [ ] Can vote
  - [ ] Comments section loads
- [ ] Add comment
  - [ ] Comment form works
  - [ ] Comment submits
  - [ ] Comment appears
- [ ] Reply to comment
  - [ ] Reply form appears
  - [ ] Reply submits
  - [ ] Nested comment appears
- [ ] Vote on comment
  - [ ] Upvote works
  - [ ] Downvote works
  - [ ] Score updates

### Responsive Tests
- [ ] Test on mobile (320px+)
- [ ] Test on tablet (768px+)
- [ ] Test on desktop (1024px+)
- [ ] Sidebar collapses on mobile
- [ ] Touch targets are 44x44px minimum

### Browser Tests
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

### Performance Tests
- [ ] Page load time < 3s
- [ ] Time to interactive < 5s
- [ ] No console errors
- [ ] No console warnings (critical)

## Security Checks

- [ ] HTTPS enabled
- [ ] JWT secrets are strong (32+ chars)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protected (parameterized queries)
- [ ] XSS protected (React escapes by default)
- [ ] CSRF protected (SameSite cookies)
- [ ] Passwords hashed with bcrypt
- [ ] No sensitive data in logs
- [ ] No API keys in frontend code

## Monitoring Setup

- [ ] Vercel Analytics enabled
- [ ] Railway metrics enabled
- [ ] Neon monitoring enabled
- [ ] Error tracking (optional: Sentry)
- [ ] Uptime monitoring (optional: UptimeRobot)

## Documentation

- [ ] README.md updated with live URLs
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment guide reviewed
- [ ] Known issues documented

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] CDN configured
- [ ] Database backups enabled
- [ ] Staging environment created
- [ ] CI/CD pipeline set up

## Launch Preparation

- [ ] Announce to team
- [ ] Prepare support channels
- [ ] Monitor for first 24 hours
- [ ] Gather user feedback
- [ ] Plan iteration based on feedback

## Rollback Plan

If something goes wrong:

1. **Frontend issues**:
   - Revert to previous Vercel deployment
   - Or disable deployment and show maintenance page

2. **Backend issues**:
   - Revert Railway deployment
   - Or scale down to fix issues

3. **Database issues**:
   - Restore from Neon backup
   - Or create new database and re-run migrations

## Success Criteria

Deployment is successful when:

✅ All smoke tests pass
✅ All user flow tests pass
✅ No critical console errors
✅ Performance metrics acceptable
✅ Security checks pass
✅ Mobile responsive
✅ Cross-browser compatible

## Post-Launch

- [ ] Monitor error rates
- [ ] Track user registrations
- [ ] Monitor API response times
- [ ] Check database performance
- [ ] Gather user feedback
- [ ] Plan next iteration

---

## Quick Reference

### URLs
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app
- Database: Neon dashboard

### Important Commands

```bash
# Redeploy frontend
cd client && vercel --prod

# Redeploy backend
cd server && railway up

# Check logs
vercel logs
railway logs

# Run migrations
railway run npm run migrate
```

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Status**: ⬜ Ready | ⬜ In Progress | ⬜ Complete | ⬜ Issues

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
