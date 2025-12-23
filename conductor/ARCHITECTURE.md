# System Architecture

## Overview
**Fit-Flow** is a modern Progressive Web App (PWA) designed to connect Personal Trainers with their Students. It leverages a serverless architecture with a heavy reliance on client-side logic and BaaS (Backend-as-a-Service).

## Tech Stack
- **Frontend Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:**
  - **Server State:** TanStack Query (React Query)
  - **Auth/Global UI State:** React Context
- **Backend/Database:** Supabase (PostgreSQL + GoTrue Auth)
- **Routing:** React Router v6

## Core Architectural Patterns

### 1. Authentication & Security
- **Auth Provider:** `src/contexts/AuthContext.tsx` wraps the application. It handles session persistence and user profile synchronization.
- **Role-Based Access Control (RBAC):**
  - **Frontend:** `ProtectedRoute` component restricts routes based on `user_type` ('personal' or 'student').
  - **Backend:** Row Level Security (RLS) policies in PostgreSQL enforce data isolation at the database layer. **This is the primary security boundary.**

### 2. Data Flow
- **Fetching:** Custom hooks (e.g., `useStudentData.ts`, `useTrainerData.ts`) wrap `useQuery`. These hooks are responsible for calling the Supabase client.
- **Mutations:** `useMutation` handles data updates. Successful mutations **must** invalidate relevant query keys to trigger a UI refresh (Optimistic UI patterns are encouraged).
- **Real-time:** Supabase Realtime subscriptions can be used for features like messaging (if implemented), but React Query's "stale-while-revalidate" is the default for standard data.

### 3. Folder Structure
- `src/components/ui`: Primitive UI components (Shadcn).
- `src/components/layout`: Layout wrappers (TrainerLayout, StudentLayout).
- `src/pages`: Top-level route components.
- `src/hooks`: Business logic and data access layer.
- `src/contexts`: Global providers.
- `src/integrations/supabase`: Client initialization and generated types.
- `supabase/migrations`: Database schema history.

### 4. Component Design
- **Container/Presenter Pattern (Loose):**
  - Page components (`src/pages/*`) act as containers, fetching data via hooks.
  - UI components (`src/components/*`) are largely presentational and receive data via props.
- **Lazy Loading:** All major route components are lazy-loaded in `App.tsx` to ensure fast initial load times.

## Key Decisions & Constraints
- **Mobile First:** The UI is designed to be fully responsive, with specific "bottom nav" layouts for students on mobile.
- **Offline Capability:** Being a PWA, basic shell caching is enabled via service worker.
- **Type Safety:** TypeScript is strict. Database types are generated from the Supabase schema to ensure end-to-end type safety.
