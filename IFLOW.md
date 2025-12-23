# FitFlow - iFlow CLI Project Context

## Project Overview

FitFlow is a modern fitness management platform designed as a Progressive Web App (PWA) to connect Personal Trainers with their Students. Built with React 18 + TypeScript, it uses Supabase as the backend service with enterprise-level security and mobile-first design principles.

**Key Features**:
- 🔒 Security-First: Row Level Security (RLS) enabled on all database tables
- 📱 Mobile-First: Responsive design optimized for mobile devices
- ⚡ Modern Stack: React 18, TypeScript, Vite, Supabase
- 🎨 Premium UI/UX: Clean, animated interface with shadcn/ui
- 📊 Analytics: Built-in progress tracking and insights
- 🚀 PWA: Offline capabilities and installable

## Tech Stack

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

## Project Structure

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

## Build and Run

### Development Environment
```bash
# Install dependencies
npm install

# Start development server (port 8080)
npm run dev

# Build production version
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Format code
npm run format

# TypeScript type checking
npm run type-check
```

### Testing
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Development Conventions

### Code Style
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Formatting**: Prettier (auto-format on save)
- **Components**: Functional components with hooks
- **Naming**: PascalCase (components), camelCase (functions/variables)

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

### Component Design
- **Container/Presenter Pattern**:
  - Page components (`src/pages/*`) act as containers, fetching data via hooks
  - UI components (`src/components/*`) are largely presentational and receive data via props
- **Lazy Loading**: All major route components are lazy-loaded in `App.tsx` to ensure fast initial load times

## Security

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

### Security Setup
Before deploying to production:
1. Run RLS setup script in Supabase
2. Verify RLS is enabled
3. Test with different user types
4. Monitor access logs

## Current Status

### Current Progress: MVP Development (45% Complete)

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

- **Sprint 1-2** (4 weeks): Complete student portal
- **Sprint 3-4** (4 weeks): Analytics and testing
- **Sprint 5-6** (4 weeks): Polish and beta launch

## Database Architecture

### Core Table Structure
- **profiles**: User profiles (personal trainer/student)
- **students**: Student details, linked to trainers
- **workouts**: Workout plans, created by trainers
- **exercises**: Specific exercises within workouts
- **workout_logs**: Student's completed workout records
- **measurements**: Student body measurement data
- **messages**: Messages between trainers and students

### Security Policies
Each table has appropriate RLS policies ensuring:
- Trainers can only see/edit their own student data
- Students can only see/edit their own data
- Data isolation is enforced at the database level

## Environment Variables

Development environment requires `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Deployment

### Recommended Platforms
**Frontend**:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ Cloudflare Pages

**Backend**:
- ✅ Supabase Cloud (managed)

### Deployment Steps
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Set environment variables
4. Deploy

## Performance Metrics

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

## Documentation Locations

### Main Documentation
- [📊 Project Review](./PROJECT_REVIEW.md) - Complete project analysis
- [📋 Executive Summary](./EXECUTIVE_SUMMARY.md) - Quick overview
- [🐛 Issues Tracker](./ISSUES.md) - Known issues and roadmap
- [🚀 Action Plan](./ACTION_PLAN.md) - 2-week sprint plan
- [✅ Deploy Checklist](./DEPLOY_CHECKLIST.md) - Production deployment

### Technical Documentation
- [🏗️ Architecture](./conductor/ARCHITECTURE.md) - System design
- [🗄️ Database](./conductor/DATABASE.md) - Schema & migrations
- [📦 Tech Stack](./conductor/tech-stack.md) - Technologies used

## Quick Links

### Commands
```bash
npm run dev          # Start development server (port 8080)
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
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

**Last Updated**: 2024-12-23  
**Version**: 0.0.0  
**Status**: 🚧 Actively in Development