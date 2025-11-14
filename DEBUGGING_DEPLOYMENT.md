# Debugging Deployment Issues

## Updated Auth Controller with Logging

The `authController.ts` has been updated with comprehensive logging to help debug registration and login issues in production.

## What Was Added

### Registration Handler Logging:
- **Before registration**: Logs username and whether passphrase exists
- **On success**: Logs userId and username
- **On failure**: Logs error message and username

### Login Handler Logging:
- **Before login**: Logs username
- **On success**: Logs userId and username  
- **On failure**: Logs error message and username

## How to Check Logs in Railway

### Step 1: Access Railway Dashboard
1. Go to https://railway.app
2. Sign in to your account
3. Open project "courteous-upliftment"
4. Click on service "Kiro_1"

### Step 2: View Deployment Logs
1. Click on the "Deployments" tab
2. Click on the most recent deployment
3. Click "View Logs" button

### Step 3: Search for Specific Log Messages

**For Registration Issues:**
```
Search for: "Register attempt"
```
This will show:
- Username being registered
- Whether passphrase was provided
- Timestamp of attempt

**If registration fails:**
```
Search for: "Registration failed"
```
This will show:
- The exact error message
- Which username failed
- Timestamp

**If registration succeeds:**
```
Search for: "Registration successful"
```
This will show:
- The created user ID
- Username

**For Login Issues:**
```
Search for: "Login attempt"
Search for: "Login failed"
Search for: "Login successful"
```

### Step 4: Common Error Messages to Look For

**Validation Errors:**
- "Username must be at least 3 characters"
- "Username must be less than 50 characters"
- "Username can only contain letters, numbers, hyphens, and underscores"
- "Passphrase must be at least 8 characters"
- "Passphrase must be less than 128 characters"

**Database Errors:**
- "Username already taken"
- Connection errors
- Query errors

**Authentication Errors:**
- "Invalid username or passphrase"
- "Account banned"

## Testing Locally First

Before deploying, test locally to ensure everything works:

```bash
# Start backend
cd server
npm run dev

# In another terminal, test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","passphrase":"testpass123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","passphrase":"testpass123"}'
```

## Deployment Checklist

Before deploying to Railway:

- [ ] All TypeScript errors fixed
- [ ] Local tests passing
- [ ] Environment variables set in Railway:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `CORS_ORIGIN`
  - `NODE_ENV=production`
- [ ] Database migrations run
- [ ] Latest code committed to GitHub
- [ ] Railway connected to correct branch

## Verifying Deployment

### 1. Check Build Logs
In Railway deployment logs, verify:
- Build completed successfully
- No TypeScript compilation errors
- Server started on correct port

### 2. Check Runtime Logs
Look for:
- "Database connected successfully"
- "Server listening at http://..."
- No startup errors

### 3. Test Health Endpoint
```bash
curl https://your-app.railway.app/health
```
Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 4. Test Registration Endpoint
```bash
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123","passphrase":"testpass123"}'
```

Expected success response (201):
```json
{
  "user": {
    "id": "...",
    "username": "testuser123",
    "karma": 0,
    "createdAt": "..."
  },
  "token": "...",
  "refreshToken": "...",
  "recoveryKey": "..."
}
```

Expected error response (400):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Username must be at least 3 characters",
    "timestamp": "..."
  }
}
```

## Common Issues and Solutions

### Issue: "Register attempt" not appearing in logs

**Cause**: Request not reaching the handler

**Solutions:**
1. Check CORS configuration - verify `CORS_ORIGIN` includes your frontend URL
2. Check route registration in `server/src/index.ts`
3. Verify API endpoint URL is correct
4. Check network tab in browser for actual request being sent

### Issue: "Registration failed" with validation error

**Cause**: Input validation failing

**Solutions:**
1. Check username length (3-50 characters)
2. Check username format (only letters, numbers, hyphens, underscores)
3. Check passphrase length (8-128 characters)
4. Verify request body format matches `RegisterRequest` type

### Issue: "Username already taken"

**Cause**: User already exists in database

**Solutions:**
1. Try a different username
2. Check database for existing users
3. If testing, clear test users from database

### Issue: Database connection errors

**Cause**: Database not accessible or misconfigured

**Solutions:**
1. Verify `DATABASE_URL` environment variable is set correctly
2. Check database is running and accessible
3. Verify database migrations have been run
4. Check Railway database service is linked

### Issue: CORS errors in browser

**Cause**: Backend not allowing requests from frontend domain

**Solutions:**
1. Update `CORS_ORIGIN` in Railway environment variables
2. Include full URL with protocol: `https://your-app.vercel.app`
3. No trailing slash in URL
4. Redeploy after updating environment variables

## Log Analysis Examples

### Successful Registration Flow:
```
[INFO] Register attempt { username: 'newuser', hasPassphrase: true, timestamp: '...' }
[INFO] Registration successful { userId: '123...', username: 'newuser' }
```

### Failed Registration (Validation):
```
[INFO] Register attempt { username: 'ab', hasPassphrase: true, timestamp: '...' }
[ERROR] Registration failed { error: 'Username must be at least 3 characters', username: 'ab', timestamp: '...' }
```

### Failed Registration (Duplicate):
```
[INFO] Register attempt { username: 'existinguser', hasPassphrase: true, timestamp: '...' }
[ERROR] Registration failed { error: 'Username already taken', username: 'existinguser', timestamp: '...' }
```

## Next Steps After Finding the Issue

1. **Fix the code** if it's a bug
2. **Update environment variables** if it's configuration
3. **Run migrations** if it's database schema
4. **Commit and push** changes to GitHub
5. **Wait for automatic deployment** or trigger manual deploy
6. **Check logs again** to verify fix worked
7. **Test from frontend** to confirm end-to-end flow

## Support Resources

- Railway Documentation: https://docs.railway.app
- Fastify Documentation: https://www.fastify.io/docs/latest/
- PostgreSQL Documentation: https://www.postgresql.org/docs/

## Quick Commands Reference

```bash
# View Railway logs (CLI)
railway logs

# Connect to Railway database
railway connect postgres

# Run migrations on Railway
railway run npm run migrate

# Check environment variables
railway variables

# Redeploy current commit
railway up
```

---

**Remember**: Always check logs first! They will tell you exactly what's happening and where the issue is.
