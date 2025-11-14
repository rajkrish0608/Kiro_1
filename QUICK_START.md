# Quick Start Guide - Anonymous Whistleblower Platform MVP

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Setup Instructions

### 1. Database Setup

```bash
# Create database
createdb whistleblower

# Or using psql
psql -U postgres
CREATE DATABASE whistleblower;
\q
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# Minimum required:
# DATABASE_URL=postgresql://user:password@localhost:5432/whistleblower
# JWT_SECRET=your-secret-key-here
# JWT_REFRESH_SECRET=your-refresh-secret-here

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Server will start on http://localhost:3000

### 3. Client Setup

```bash
cd client

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Start development server
npm run dev
```

Client will start on http://localhost:5174

## Testing the MVP

### 1. Register a User
- Navigate to http://localhost:5174
- Click "Sign Up" or go to /register
- Enter username and passphrase
- Save your recovery key!

### 2. Create a Post
- Click "Create Post" in sidebar
- Fill in title and content
- Add tags (optional)
- Submit

### 3. Browse Feed
- View posts in feed
- Switch between Recent/Trending/Top
- Scroll to load more posts

### 4. Engage with Content
- Click on a post to view details
- Upvote/downvote posts
- Write comments
- Reply to comments
- Vote on comments

## Default Credentials

No default users - you must register a new account.

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in server/.env
- Verify database exists

### Port Already in Use
- Server: Change PORT in server/.env
- Client: Vite will auto-increment port

### Migration Errors
- Drop and recreate database
- Run migrations again

### Build Errors
- Delete node_modules and package-lock.json
- Run npm install again
- Check Node.js version (18+)

## API Documentation

### Base URL
`http://localhost:3000/api`

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

#### Posts
- `GET /posts` - Get feed (query: page, limit, sort, communityId)
- `POST /posts` - Create post (auth required)
- `GET /posts/:id` - Get post by ID
- `PUT /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)

#### Votes
- `POST /votes` - Cast vote (auth required)
- `GET /votes/:targetType/:targetId/user` - Get user vote
- `GET /votes/:targetType/:targetId/counts` - Get vote counts

#### Comments
- `GET /comments/post/:postId` - Get comments (query: sort)
- `POST /comments` - Create comment (auth required)
- `DELETE /comments/:id` - Delete comment (auth required)

## Features Included in MVP

✅ Anonymous registration & login
✅ Post creation with tags
✅ Post feed with sorting
✅ Voting on posts & comments
✅ Nested comments (5 levels)
✅ Responsive design
✅ Dark theme UI

## What's NOT in MVP

❌ File uploads
❌ User profiles
❌ Search functionality
❌ Content reporting
❌ Admin dashboard
❌ Email notifications

## Next Steps

1. Test all user flows
2. Check responsive design on mobile
3. Verify database persistence
4. Test error scenarios
5. Gather user feedback

## Support

For issues or questions, check:
- MVP_TEST_REPORT.md for detailed test results
- .kiro/specs/ for requirements and design docs
- Server logs for backend errors
- Browser console for frontend errors

---

**MVP Status**: ✅ Ready for Testing
**Last Updated**: $(date)
