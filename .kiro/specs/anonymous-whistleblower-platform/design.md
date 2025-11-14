# Design Document

## Overview

The Anonymous Whistleblower Platform is a full-stack web application designed to provide a secure, anonymous environment for reporting corruption, injustice, and government wrongdoing. The platform emphasizes privacy, security, and user experience through a dark-themed interface with glassmorphic design elements and neon green accents.

### Core Principles

1. **Privacy First**: No collection of personally identifiable information
2. **Security by Design**: End-to-end encryption options, HTTPS-only, strict CSP
3. **Anonymous by Default**: All interactions are pseudonymous
4. **Performance Optimized**: Fast load times, efficient caching, CDN delivery
5. **Scalable Architecture**: Designed to handle high traffic and concurrent users

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for build tooling
- React Router for navigation
- CSS Modules for styling (no Tailwind, no SCSS)
- Framer Motion for animations
- Formik + Yup for form validation
- React Helmet for SEO

**Backend:**
- Node.js with Fastify or Express
- PostgreSQL (Supabase or Neon) for primary database
- Redis for caching and rate limiting
- JWT for authentication

**Infrastructure:**
- Vercel or Render for hosting
- Supabase or Neon for database
- AWS S3 or Cloudflare R2 for file storage
- CDN for static asset delivery

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  React Router│  │ Framer Motion│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Rate Limiter │  │     Auth     │  │     CORS     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Post API   │  │   User API   │  │  Comment API │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Vote API   │  │  Search API  │  │   Admin API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │     Redis    │  │   S3/R2      │      │
│  │   Database   │  │    Cache     │  │  File Store  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### System Components

1. **Client Application**: React SPA with TypeScript
2. **API Server**: RESTful API built with Fastify/Express
3. **Database**: PostgreSQL for relational data
4. **Cache Layer**: Redis for session management and rate limiting
5. **File Storage**: Cloud storage for user uploads
6. **CDN**: Content delivery for static assets and uploads

## Components and Interfaces

### Frontend Components

#### Layout Components

**Sidebar Navigation**
- Fixed left sidebar with navigation links
- Icons for Home, Search, Communities, Join, Unsung Legends, Pix
- "Create Post" button with icon
- Collapsible on mobile devices
- Props: `isOpen: boolean`, `onToggle: () => void`

**Header**
- Top navigation bar with logo
- User profile dropdown
- Notifications icon
- Search bar (on desktop)
- Props: `user: User | null`, `onLogout: () => void`

**Feed Container**
- Main content area with infinite scroll
- Tab switcher for Recent/Trending/Top
- Loading states and error boundaries
- Props: `feedType: 'recent' | 'trending' | 'top'`, `communityId?: string`

#### Content Components

**PostCard**
- Glassmorphic card design
- Vote buttons (upvote/downvote)
- Post metadata (author, timestamp, community)
- Title and preview text
- Comment count and share button
- Category badges and tags
- Props: `post: Post`, `onVote: (direction: 'up' | 'down') => void`

**CommentThread**
- Nested comment display (up to 5 levels)
- Vote buttons for each comment
- Reply functionality
- Collapse/expand threads
- Props: `comments: Comment[]`, `postId: string`, `maxDepth: number`

**CreatePostForm**
- Multi-step form with validation
- Community selector dropdown
- Title and content text areas
- Tag input with autocomplete
- File upload with preview
- Optional encryption toggle
- Props: `onSubmit: (post: PostInput) => Promise<void>`

**UserProfile**
- Profile header with username and stats
- Tab navigation (Posts, Comments, Settings)
- Activity feed
- Karma score display
- Props: `userId: string`, `isOwnProfile: boolean`

#### UI Components

**Button**
- Variants: primary, secondary, ghost, danger
- Sizes: small, medium, large
- Loading and disabled states
- Props: `variant`, `size`, `loading`, `disabled`, `onClick`

**Card**
- Glassmorphic background with blur
- Subtle border and shadow
- Padding variants
- Props: `variant: 'default' | 'elevated'`, `padding: 'sm' | 'md' | 'lg'`

**Modal**
- Overlay with backdrop blur
- Close button and escape key support
- Scroll lock when open
- Props: `isOpen: boolean`, `onClose: () => void`, `title: string`

**Input**
- Text, textarea, password variants
- Error states and validation messages
- Label and helper text
- Props: `type`, `value`, `onChange`, `error`, `label`

**Dropdown**
- Custom styled select component
- Search/filter capability
- Multi-select support
- Props: `options: Option[]`, `value`, `onChange`, `multiple`

### Backend API Endpoints

#### Authentication Endpoints

```typescript
POST /api/auth/register
Body: { username: string, passphrase: string }
Response: { user: User, token: string, recoveryKey: string }

POST /api/auth/login
Body: { username: string, passphrase: string }
Response: { user: User, token: string }

POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }

GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user: User }
```

#### Post Endpoints

```typescript
GET /api/posts
Query: { page: number, limit: number, sort: 'recent' | 'trending' | 'top', communityId?: string }
Response: { posts: Post[], hasMore: boolean, total: number }

GET /api/posts/:id
Response: { post: Post }

POST /api/posts
Headers: { Authorization: Bearer <token> }
Body: { title: string, content: string, communityId: string, tags: string[], encrypted: boolean }
Response: { post: Post }

PUT /api/posts/:id
Headers: { Authorization: Bearer <token> }
Body: { title?: string, content?: string, tags?: string[] }
Response: { post: Post }

DELETE /api/posts/:id
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }
```

#### Vote Endpoints

```typescript
POST /api/votes
Headers: { Authorization: Bearer <token> }
Body: { targetId: string, targetType: 'post' | 'comment', direction: 'up' | 'down' }
Response: { vote: Vote, newScore: number }

DELETE /api/votes/:id
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }
```

#### Comment Endpoints

```typescript
GET /api/comments
Query: { postId: string, sort: 'top' | 'new' | 'controversial' }
Response: { comments: Comment[] }

POST /api/comments
Headers: { Authorization: Bearer <token> }
Body: { postId: string, content: string, parentId?: string }
Response: { comment: Comment }

PUT /api/comments/:id
Headers: { Authorization: Bearer <token> }
Body: { content: string }
Response: { comment: Comment }

DELETE /api/comments/:id
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }
```

#### User Endpoints

```typescript
GET /api/users/:id
Response: { user: PublicUser, stats: UserStats }

GET /api/users/:id/posts
Query: { page: number, limit: number }
Response: { posts: Post[], hasMore: boolean }

GET /api/users/:id/comments
Query: { page: number, limit: number }
Response: { comments: Comment[], hasMore: boolean }
```

#### Community Endpoints

```typescript
GET /api/communities
Response: { communities: Community[] }

GET /api/communities/:id
Response: { community: Community, stats: CommunityStats }

POST /api/communities/:id/join
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }
```

#### Search Endpoints

```typescript
GET /api/search
Query: { q: string, type: 'posts' | 'users' | 'communities', page: number }
Response: { results: SearchResult[], hasMore: boolean }
```

#### Report Endpoints

```typescript
POST /api/reports
Headers: { Authorization: Bearer <token> }
Body: { targetId: string, targetType: 'post' | 'comment', reason: string }
Response: { report: Report }
```

#### Admin Endpoints

```typescript
GET /api/admin/reports
Headers: { Authorization: Bearer <admin-token> }
Query: { status: 'pending' | 'resolved', page: number }
Response: { reports: Report[], hasMore: boolean }

PUT /api/admin/reports/:id
Headers: { Authorization: Bearer <admin-token> }
Body: { status: 'approved' | 'removed', action: string }
Response: { report: Report }

DELETE /api/admin/posts/:id
Headers: { Authorization: Bearer <admin-token> }
Response: { success: boolean }

PUT /api/admin/users/:id/ban
Headers: { Authorization: Bearer <admin-token> }
Body: { reason: string, duration?: number }
Response: { success: boolean }
```

#### File Upload Endpoints

```typescript
POST /api/upload
Headers: { Authorization: Bearer <token>, Content-Type: multipart/form-data }
Body: FormData with file
Response: { url: string, fileId: string }
```

## Data Models

### User Model

```typescript
interface User {
  id: string;                    // UUID
  username: string;              // Unique pseudonymous username
  passphraseHash: string;        // Hashed passphrase (bcrypt)
  deviceFingerprint?: string;    // Optional device identification
  recoveryKey: string;           // Encrypted recovery key
  role: 'user' | 'admin';        // User role
  karma: number;                 // Total karma score
  createdAt: Date;               // Account creation timestamp
  lastLoginAt: Date;             // Last login timestamp
  isBanned: boolean;             // Ban status
  banReason?: string;            // Reason for ban
  banExpiresAt?: Date;           // Ban expiration
}

interface PublicUser {
  id: string;
  username: string;
  karma: number;
  createdAt: Date;
  // No sensitive fields exposed
}
```

### Post Model

```typescript
interface Post {
  id: string;                    // UUID
  authorId: string;              // Foreign key to User
  communityId: string;           // Foreign key to Community
  title: string;                 // Post title (10-200 chars)
  content: string;               // Post content (10-10000 chars)
  encrypted: boolean;            // Whether content is encrypted
  tags: string[];                // Array of tag strings
  voteScore: number;             // Net vote count (upvotes - downvotes)
  commentCount: number;          // Total comment count
  viewCount: number;             // View count
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  deletedAt?: Date;              // Soft delete timestamp
}
```

### Comment Model

```typescript
interface Comment {
  id: string;                    // UUID
  postId: string;                // Foreign key to Post
  authorId: string;              // Foreign key to User
  parentId?: string;             // Foreign key to parent Comment (for nesting)
  content: string;               // Comment content (1-2000 chars)
  depth: number;                 // Nesting depth (0-5)
  voteScore: number;             // Net vote count
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  deletedAt?: Date;              // Soft delete timestamp
}
```

### Vote Model

```typescript
interface Vote {
  id: string;                    // UUID
  userId: string;                // Foreign key to User
  targetId: string;              // ID of post or comment
  targetType: 'post' | 'comment'; // Type of target
  direction: 'up' | 'down';      // Vote direction
  createdAt: Date;               // Vote timestamp
}

// Unique constraint on (userId, targetId, targetType)
```

### Community Model

```typescript
interface Community {
  id: string;                    // UUID
  name: string;                  // Community name
  slug: string;                  // URL-friendly slug
  description: string;           // Community description
  icon?: string;                 // Icon URL
  memberCount: number;           // Total members
  postCount: number;             // Total posts
  createdAt: Date;               // Creation timestamp
}
```

### Report Model

```typescript
interface Report {
  id: string;                    // UUID
  reporterId: string;            // Foreign key to User
  targetId: string;              // ID of reported content
  targetType: 'post' | 'comment'; // Type of reported content
  reason: string;                // Report reason
  status: 'pending' | 'approved' | 'rejected'; // Report status
  reviewedBy?: string;           // Admin user ID
  reviewedAt?: Date;             // Review timestamp
  action?: string;               // Action taken
  createdAt: Date;               // Report timestamp
}
```

### File Model

```typescript
interface File {
  id: string;                    // UUID
  userId: string;                // Foreign key to User
  postId?: string;               // Foreign key to Post (if attached)
  filename: string;              // Original filename
  mimeType: string;              // File MIME type
  size: number;                  // File size in bytes
  url: string;                   // CDN URL
  storageKey: string;            // S3/R2 storage key
  createdAt: Date;               // Upload timestamp
}
```

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```typescript
interface ErrorResponse {
  error: {
    code: string;                // Machine-readable error code
    message: string;             // Human-readable error message
    details?: any;               // Optional additional details
    timestamp: string;           // ISO timestamp
  }
}
```

### Error Codes

- `AUTH_REQUIRED`: Authentication required (401)
- `AUTH_INVALID`: Invalid credentials (401)
- `FORBIDDEN`: Insufficient permissions (403)
- `NOT_FOUND`: Resource not found (404)
- `VALIDATION_ERROR`: Input validation failed (400)
- `RATE_LIMIT_EXCEEDED`: Too many requests (429)
- `SERVER_ERROR`: Internal server error (500)
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable (503)

### Frontend Error Handling

1. **Network Errors**: Display toast notification with retry option
2. **Validation Errors**: Show inline field errors
3. **Authentication Errors**: Redirect to login page
4. **Server Errors**: Display error page with support contact
5. **Rate Limiting**: Show cooldown timer

### Backend Error Handling

1. **Try-Catch Blocks**: Wrap all async operations
2. **Error Middleware**: Centralized error handling
3. **Logging**: Log all errors with context (Winston/Pino)
4. **Monitoring**: Track error rates and patterns
5. **Graceful Degradation**: Fallback mechanisms for non-critical features

## Testing Strategy

### Frontend Testing

**Unit Tests (Jest + React Testing Library)**
- Component rendering and props
- User interactions (clicks, form inputs)
- State management logic
- Utility functions
- Target: 80% code coverage

**Integration Tests**
- API integration with mock server
- Form submission flows
- Navigation and routing
- Authentication flows

**E2E Tests (Playwright)**
- Critical user journeys
- Post creation and publishing
- Voting and commenting
- User registration and login
- Search functionality

### Backend Testing

**Unit Tests (Jest)**
- Service layer functions
- Data validation logic
- Utility functions
- Target: 80% code coverage

**Integration Tests**
- API endpoint responses
- Database operations
- Authentication middleware
- Rate limiting

**Load Tests (k6)**
- Concurrent user simulation
- API endpoint performance
- Database query optimization
- Cache effectiveness

### Security Testing

- **OWASP Top 10**: Test for common vulnerabilities
- **Penetration Testing**: Simulate attacks
- **Dependency Scanning**: Check for vulnerable packages
- **SQL Injection**: Test input sanitization
- **XSS Prevention**: Test content rendering

## Design Tokens

### Color Palette

```css
:root {
  /* Background Colors */
  --bg-primary: #0b0b0b;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  --bg-card: rgba(255, 255, 255, 0.03);
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  
  /* Accent Colors */
  --accent-primary: #00ff00;
  --accent-hover: #00d000;
  --accent-active: #00a000;
  
  /* Status Colors */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  --status-info: #3b82f6;
  
  /* Border Colors */
  --border-subtle: rgba(255, 255, 255, 0.1);
  --border-default: rgba(255, 255, 255, 0.2);
  
  /* Shadow */
  --shadow-soft: 0 6px 20px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(0, 255, 0, 0.3);
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Fully rounded */
}
```

### Animations

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Security Considerations

### Authentication Security

1. **Passphrase Hashing**: Use bcrypt with cost factor 12
2. **JWT Tokens**: Short-lived access tokens (15 min), refresh tokens (7 days)
3. **Token Storage**: HttpOnly cookies for refresh tokens
4. **Device Fingerprinting**: Canvas fingerprinting + user agent
5. **Brute Force Protection**: Rate limit login attempts (5 per 15 min)

### Data Protection

1. **Encryption at Rest**: Database encryption enabled
2. **Encryption in Transit**: TLS 1.3 only
3. **Optional Client-Side Encryption**: AES-256-GCM for sensitive posts
4. **Input Sanitization**: DOMPurify for user-generated content
5. **SQL Injection Prevention**: Parameterized queries only

### Privacy Protection

1. **No PII Collection**: Zero personal information stored
2. **IP Address Handling**: Hash IPs for rate limiting, don't store raw
3. **Temporary Session Data**: Clear after logout
4. **Anonymous Analytics**: No user tracking, aggregate metrics only
5. **GDPR Compliance**: Right to deletion, data export

### Content Security

1. **CSP Headers**: Strict Content Security Policy
2. **XSS Prevention**: Sanitize all user input
3. **CSRF Protection**: CSRF tokens for state-changing operations
4. **File Upload Validation**: Whitelist MIME types, scan for malware
5. **Rate Limiting**: Prevent abuse (100 req/min per IP)

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Route-based lazy loading
2. **Image Optimization**: WebP format, lazy loading, responsive images
3. **Bundle Size**: Tree shaking, minification, compression
4. **Caching**: Service worker for offline support
5. **Virtual Scrolling**: For long lists and feeds

### Backend Optimization

1. **Database Indexing**: Index on frequently queried fields
2. **Query Optimization**: Use EXPLAIN to optimize slow queries
3. **Connection Pooling**: Reuse database connections
4. **Caching Strategy**: Redis for hot data (posts, user sessions)
5. **CDN**: Serve static assets and uploads via CDN

### Caching Strategy

**Redis Cache Keys:**
- `post:{id}` - Individual post data (TTL: 5 min)
- `feed:recent:{page}` - Recent posts feed (TTL: 1 min)
- `feed:trending:{page}` - Trending posts feed (TTL: 5 min)
- `user:{id}:profile` - User profile data (TTL: 10 min)
- `community:{id}` - Community data (TTL: 30 min)
- `ratelimit:{ip}:{endpoint}` - Rate limit counters (TTL: 1 min)

**Cache Invalidation:**
- Invalidate on write operations (create, update, delete)
- Use cache tags for related data
- Implement cache warming for popular content

## Deployment Architecture

### Production Environment

**Frontend Deployment (Vercel)**
- Automatic deployments from main branch
- Preview deployments for PRs
- Edge caching and CDN
- Environment variables for API endpoints

**Backend Deployment (Render/Railway)**
- Docker containerization
- Auto-scaling based on load
- Health checks and monitoring
- Environment variables for secrets

**Database (Supabase/Neon)**
- Managed PostgreSQL instance
- Automatic backups (daily)
- Point-in-time recovery
- Connection pooling

**Redis (Upstash/Redis Cloud)**
- Managed Redis instance
- High availability setup
- Automatic failover

**File Storage (AWS S3/Cloudflare R2)**
- Object storage for uploads
- CDN integration
- Lifecycle policies for old files

### CI/CD Pipeline

1. **Code Push**: Developer pushes to GitHub
2. **Automated Tests**: Run unit, integration tests
3. **Build**: Create production build
4. **Deploy to Staging**: Automatic deployment
5. **E2E Tests**: Run on staging environment
6. **Deploy to Production**: Manual approval required
7. **Monitoring**: Track errors and performance

### Monitoring and Logging

**Application Monitoring:**
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)

**Logging:**
- Structured logging (Winston/Pino)
- Log aggregation (Logtail/Papertrail)
- Log retention (30 days)

**Metrics:**
- API response times
- Database query performance
- Cache hit rates
- Error rates
- User activity metrics

## Accessibility

1. **WCAG 2.1 AA Compliance**: Meet accessibility standards
2. **Keyboard Navigation**: Full keyboard support
3. **Screen Reader Support**: ARIA labels and semantic HTML
4. **Color Contrast**: Minimum 4.5:1 ratio for text
5. **Focus Indicators**: Visible focus states for interactive elements

## Internationalization (Future)

While the initial version will be English-only, the architecture supports future i18n:

1. **Text Extraction**: All UI text in translation files
2. **Date/Time Formatting**: Use Intl API
3. **RTL Support**: CSS logical properties
4. **Language Detection**: Browser language preference
5. **Translation Management**: Integration with translation services
