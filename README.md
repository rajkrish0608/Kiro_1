# Anonymous Whistleblower Platform - MVP

A secure, anonymous platform for whistleblowers to share information without fear of retaliation.

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/whistleblower-mvp)
- **Status**: MVP Complete ✅

## ✨ Features

### Core Functionality
- ✅ **Anonymous Authentication** - Register and login without email
- ✅ **Post Creation** - Share information with title, content, and tags
- ✅ **Post Feed** - Browse posts with Recent/Trending/Top sorting
- ✅ **Voting System** - Upvote/downvote posts and comments
- ✅ **Nested Comments** - Engage in discussions (5 levels deep)
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Dark Theme** - Easy on the eyes with glassmorphic UI

### Security & Privacy
- 🔒 JWT-based authentication
- 🔒 Bcrypt password hashing
- 🔒 Recovery key system
- 🔒 Optional post encryption
- 🔒 No email required
- 🔒 No tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS Modules** - Styling
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Fastify** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication

## 📦 Project Structure

```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles
│   └── package.json
│
├── server/                # Backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, validation
│   │   ├── types/         # TypeScript types
│   │   └── config/        # Configuration
│   ├── migrations/        # Database migrations
│   └── package.json
│
└── .kiro/specs/          # Requirements & design docs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/whistleblower-mvp.git
cd whistleblower-mvp
```

2. **Set up database**
```bash
createdb whistleblower
```

3. **Configure environment**
```bash
# Server
cd server
cp .env.example .env
# Edit .env with your database credentials

# Client
cd ../client
cp .env.example .env
# Edit .env with API URL
```

4. **Install dependencies**
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

5. **Run migrations**
```bash
cd server
npm run migrate
```

6. **Start development servers**
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

7. **Open browser**
```
http://localhost:5174
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/whistleblower-mvp)

1. Click the button above
2. Set up environment variables
3. Deploy!

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [MVP Test Report](./MVP_TEST_REPORT.md)
- [Requirements](./kiro/specs/anonymous-whistleblower-platform/requirements.md)
- [Design Document](./.kiro/specs/anonymous-whistleblower-platform/design.md)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Check TypeScript
npm run type-check

# Lint code
npm run lint
```

## 📊 MVP Status

**Completion**: 15/25 tasks (60%)

### ✅ Completed
- Authentication system
- Post creation & viewing
- Post feed with sorting
- Voting system
- Comment system
- Responsive UI

### 🔜 Planned
- File uploads
- User profiles
- Search functionality
- Content reporting
- Admin dashboard
- Performance optimization

## 🤝 Contributing

This is an MVP. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🔒 Security

- Report security issues to: security@yourplatform.com
- Do not post security issues publicly
- We take security seriously

## 💡 Roadmap

### Phase 1 (MVP) ✅
- Core posting and commenting
- Anonymous authentication
- Basic moderation

### Phase 2 (Next)
- File attachments
- Advanced search
- User reputation system
- Content verification

### Phase 3 (Future)
- End-to-end encryption
- Decentralized storage
- Multi-language support
- Mobile apps

## 📞 Support

- **Documentation**: Check the docs folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 🙏 Acknowledgments

Built with:
- React & Vite
- Fastify
- PostgreSQL
- TypeScript
- And many other open-source tools

---

**Status**: MVP Ready for Deployment 🚀

**Last Updated**: 2024

Made with ❤️ for whistleblowers everywhere
