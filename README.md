# FitFlow - Fitness Management Platform 💪

<div align="center">

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Version](https://img.shields.io/badge/Version-0.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)

**A comprehensive, secure, and modern fitness management platform**

[Features](#-features) •
[Quick Start](#-quick-start) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

---

## 📖 Overview

FitFlow is a Progressive Web App (PWA) designed to streamline the interaction between Personal Trainers and their Students. Built with modern web technologies and enterprise-level security, it provides an intuitive interface for workout management, progress tracking, and coach-client communication.

### 🎯 Key Highlights

- **🔒 Security-First**: Row Level Security (RLS) on all database tables
- **📱 Mobile-First**: Responsive design optimized for mobile devices
- **⚡ Modern Stack**: React 18, TypeScript, Vite, Supabase
- **🎨 Premium UI/UX**: Clean, animated interface with shadcn/ui
- **📊 Analytics**: Built-in progress tracking and insights
- **🚀 PWA**: Offline capabilities and installable

---

## ✨ Features

### For Personal Trainers 👨‍🏫

<details>
<summary><b>Click to expand trainer features</b></summary>

- **📊 Dashboard**
  - Real-time overview of active students
  - Weekly activity charts
  - Upcoming sessions
  - Key metrics at a glance

- **👥 Student Management**
  - Complete CRUD operations
  - Student profiles with goals and restrictions
  - Progress tracking per student
  - Search and filtering

- **📋 Workout Planning**
  - Create reusable workout templates
  - Library of exercises
  - Detailed exercise configuration (sets, reps, rest)
  - Drag & drop exercise ordering

- **🎯 Assignment & Tracking**
  - Assign plans to students with one click
  - View workout completion history
  - Analyze student adherence
  - Personal records tracking

</details>

### For Students/Athletes 🏃

<details>
<summary><b>Click to expand student features</b></summary>

- **🎮 Workout Execution**
  - Interactive workout player
  - Real-time set/rep/weight logging
  - Automatic rest timer
  - Progress within workout

- **📈 Progress Tracking**
  - Workout history
  - Volume charts
  - Personal records
  - Streak tracking

- **📊 Analytics**
  - Performance graphs
  - Body measurements
  - Progress photos
  - Goal tracking

- **👤 Profile Management**
  - Personal information
  - Goals and preferences
  - Statistics overview

</details>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18+ ([Download](https://nodejs.org))
- **npm** or **yarn** or **bun**
- **Supabase Account**: [Sign up](https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fit-flow.git
   cd fit-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up the database**
   
   Go to your Supabase SQL Editor and run:
   ```bash
   # Copy contents of these files in order:
   supabase/migrations/20251223000001_initial_schema.sql
   supabase/migrations/20251223000000_add_exercise_logs.sql
   supabase/migrations/20251223000002_enable_rls.sql
   ```

   Or use Supabase CLI:
   ```bash
   supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080)

### Quick Test

Create a test account:
```bash
# In Supabase Authentication
1. Go to Authentication > Users
2. Add user manually or use signup form
3. User type: 'personal' or 'student'
```

---

## 🏗️ Tech Stack

### Frontend

```
React 18.3       → UI framework
TypeScript 5.8   → Type safety
Vite 5.4         → Build tool & dev server
Tailwind CSS     → Styling
shadcn/ui        → Component library
Framer Motion    → Animations
```

### Backend & Infrastructure

```
Supabase         → Backend-as-a-Service
  ├─ PostgreSQL  → Database
  ├─ GoTrue      → Authentication
  ├─ PostgREST   → Auto-generated API
  └─ Realtime    → WebSocket subscriptions

TanStack Query   → Server state management
React Router     → Client-side routing
```

### Development Tools

```
ESLint           → Code linting
Prettier         → Code formatting
Vitest           → Unit testing
Testing Library  → Component testing
```

---

## 📁 Project Structure

```
fit-flow/
├── 📂 src/
│   ├── 📂 components/       # React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout wrappers
│   │   └── ui/             # UI primitives (shadcn)
│   │
│   ├── 📂 pages/           # Route components
│   │   ├── auth/           # Login, signup
│   │   ├── trainer/        # Trainer dashboard & features
│   │   └── student/        # Student portal
│   │
│   ├── 📂 hooks/           # Custom React hooks
│   ├── 📂 contexts/        # React contexts
│   ├── 📂 integrations/    # External services
│   ├── 📂 lib/             # Utilities
│   └── 📂 types/           # TypeScript definitions
│
├── 📂 supabase/            # Database & backend
│   ├── migrations/         # SQL migrations
│   └── setup_rls.sql       # Security policies
│
├── 📂 public/              # Static assets
└── 📂 conductor/           # Project documentation
```

---

## 🔒 Security

### Row Level Security (RLS)

All database tables are protected with RLS policies:

✅ **Personal Trainers** can only access:
- Their own students
- Workouts they created
- Logs from their students

✅ **Students** can only access:
- Their own data
- Workouts assigned to them
- Their own workout logs

### Setup Security

**CRITICAL**: Before deploying to production:

1. Run RLS setup script in Supabase:
   ```sql
   -- Copy contents from:
   supabase/setup_rls.sql
   ```

2. Verify RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

3. Test with different user types
4. Monitor access logs

📚 **Read more**: [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/           # Unit tests
└── components/
    └── MyComponent.test.tsx
```

### Current Coverage
```
Unit Tests:        ~15%
Integration:       ~5%
E2E:               0%
```

**Goal**: 60% coverage before MVP launch

---

## 📚 Documentation

### Main Docs
- [📊 Project Review](./PROJECT_REVIEW.md) - Complete project analysis
- [📋 Executive Summary](./EXECUTIVE_SUMMARY.md) - Quick overview
- [🐛 Issues Tracker](./ISSUES.md) - Known issues and roadmap
- [🚀 Action Plan](./ACTION_PLAN.md) - 2-week sprint plan
- [✅ Deploy Checklist](./DEPLOY_CHECKLIST.md) - Production deployment

### Technical Docs
- [🏗️ Architecture](./conductor/ARCHITECTURE.md) - System design
- [🗄️ Database](./conductor/DATABASE.md) - Schema & migrations
- [📦 Tech Stack](./conductor/tech-stack.md) - Technologies used
- [📝 Product](./conductor/product.md) - Product requirements

---

## 🚧 Development Status

### Current Phase: MVP Development (45% Complete)

```
✅ Completed
  ├─ Authentication (100%)
  ├─ Security/RLS (100%)
  ├─ UI/UX Design (90%)
  └─ Infrastructure (95%)

🔄 In Progress
  ├─ Trainer Dashboard (80%)
  ├─ Student Management (70%)
  └─ Workout Planning (75%)

⏳ Planned
  ├─ Student Portal (40%)
  ├─ Workout Execution (30%)
  └─ Analytics (10%)
```

### Next Milestones

- **Sprint 1-2** (4 weeks): Complete student portal- **Sprint 3-4** (4 weeks): Analytics and testing
- **Sprint 5-6** (4 weeks): Polish and beta launch

📖 **Full Roadmap**: [ISSUES.md](./ISSUES.md)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructure
test:     Adding tests
chore:    Maintenance
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Formatting**: Prettier (auto-format on save)
- **Components**: Functional components with hooks
- **Naming**: PascalCase (components), camelCase (functions/vars)

### PR Guidelines

- ✅ Description explains the change
- ✅ Tests included (if applicable)
- ✅ No linting errors
- ✅ Mobile tested
- ✅ Documentation updated

---

## 🐛 Reporting Issues

Found a bug? Have a feature request?

1. **Check existing issues**: [Issues Tracker](./ISSUES.md)
2. **Create new issue**: [GitHub Issues](https://github.com/your-username/fit-flow/issues)
3. **Include**:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if UI bug)
   - Environment (browser, OS)

---

## 📅 Roadmap

### Phase 1: MVP (Current)
- [x] Authentication & Security
- [x] Trainer Dashboard
- [x] Student Management
- [ ] Student Portal ← **In Progress**
- [ ] Workout Execution
- [ ] Basic Analytics

### Phase 2: Growth
- [ ] Messaging System
- [ ] Push Notifications
- [ ] Exercise Library
- [ ] Body Measurements
- [ ] Progress Photos

### Phase 3: Scale
- [ ] Gamification
- [ ] Advanced Analytics
- [ ] Subscription/Billing
- [ ] Admin Panel
- [ ] White-label Support

📊 **Detailed Roadmap**: [ISSUES.md](./ISSUES.md)

---

## 📊 Performance

### Metrics

```
Lighthouse Score (Desktop)
  Performance:     85/100 ⚠️
  Accessibility:   95/100 ✅
  Best Practices:  90/100 ✅
  SEO:             85/100 ⚠️
  PWA:             60/100 ⚠️

Bundle Size:       ~450KB gzipped
First Paint:       1.2s ✅
Time to Interactive: 2.8s ⚠️
```

### Optimization Targets

- [ ] Performance > 90
- [ ] PWA > 80
- [ ] Bundle < 400KB
- [ ] TTI < 2s

---

## 🌐 Deployment

### Recommended Platforms

**Frontend**:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ Cloudflare Pages

**Backend**:
- ✅ Supabase Cloud (managed)

### Deploy Steps

1. **Push to GitHub**
2. **Connect to Vercel/Netlify**
3. **Set environment variables**
4. **Deploy**

📝 **Full Guide**: [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

### Environment Variables

Required for production:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

---

## 📱 Progressive Web App (PWA)

FitFlow is installable as a PWA:

### Features
- ✅ Offline access to cached content
- ✅ Add to home screen
- ✅ App-like experience
- 🔄 Background sync (in development)
- 🔄 Push notifications (planned)

### Installation

**On Mobile**:
1. Open in browser
2. Tap "Add to Home Screen"
3. Launch as app

**On Desktop**:
1. Click install icon in address bar
2. Follow prompts

---

## 🔧 Scripts

### Development

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript check
```

### Testing

```bash
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 🏆 Credits

### Built With

- [React](https://react.dev) - UI Framework
- [Supabase](https://supabase.com) - Backend
- [Vite](https://vitejs.dev) - Build Tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Components
- [TanStack Query](https://tanstack.com/query) - Data Fetching
- [Framer Motion](https://www.framer.com/motion) - Animations

### Inspiration

- Modern fitness apps
- Personal training workflows
- SaaS best practices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support & Community

### Get Help

- 📧 **Email**: support@fitflow.app (coming soon)
- 💬 **Discord**: [Join our server](https://discord.gg/fitflow) (coming soon)
- 📖 **Docs**: [Full documentation](./PROJECT_REVIEW.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/fit-flow/issues)

### Stay Updated

- ⭐ Star this repo
- 👀 Watch for updates
- 🍴 Fork and contribute
- 📢 Share with trainers

---

## 🙏 Acknowledgments

Special thanks to:
- The React team for an amazing framework
- Supabase for making backend development simple
- The open-source community
- Early beta testers (you know who you are!)

---

## 📊 Project Stats

```
📝 Lines of Code:      ~15,000
⚛️  Components:         ~80
🪝 Custom Hooks:       ~12
📄 Pages:              15
🧪 Tests:              ~40 (growing!)
⭐ GitHub Stars:       0 (be the first!)
```

---

<div align="center">

**Made with ❤️ by the FitFlow Team**

[⬆ Back to Top](#fitflow---fitness-management-platform-)

</div>

---

## 🔗 Quick Links

### Documentation
- [📊 Complete Project Review](./PROJECT_REVIEW.md)
- [📋 Executive Summary](./EXECUTIVE_SUMMARY.md)
- [🐛 Issues & Roadmap](./ISSUES.md)
- [🚀 2-Week Action Plan](./ACTION_PLAN.md)

### Technical
- [🏗️ Architecture Guide](./conductor/ARCHITECTURE.md)
- [🗄️ Database Schema](./conductor/DATABASE.md)
- [📦 Tech Stack Details](./conductor/tech-stack.md)

### Deployment
- [✅ Deploy Checklist](./DEPLOY_CHECKLIST.md)
- [🔒 Security Guide](./supabase/setup_rls.sql)

---

**Last Updated**: 2024-12-23  
**Version**: 0.0.0  
**Status**: 🚧 In Active Development