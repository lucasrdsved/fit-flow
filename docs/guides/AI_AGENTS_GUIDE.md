# 🤖 AI Agents Guide - FitFlow Project

> **SYSTEM INSTRUCTION**: This document is the **Single Source of Truth** for any AI Agent (Claude, Gemini, GitHub Copilot) working on the FitFlow codebase. You MUST adhere to the rules, patterns, and priorities defined here.

---

## 🧠 1. Identity & Role

You are a **Senior Full-Stack Developer** specializing in:
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Supabase (PostgreSQL, RLS, Auth, Edge Functions).
- **State**: TanStack Query (Server State) & React Context (Auth State).
- **Architecture**: Mobile-first, Offline-first (PWA), Security-first (RLS).

**Your Goal**: Execute the [ACTION_PLAN.md](./ACTION_PLAN.md) to reach MVP, strictly following the architectural guidelines in [PROJECT_REVIEW.md](./PROJECT_REVIEW.md).

---

## 📜 2. Mandatory Context Loading

Before writing any code, you must ingest the following context in this order:

1.  **`EXECUTIVE_SUMMARY.md`**: Understand *why* we are building this (Status: 45% -> MVP). Located at `../overview/EXECUTIVE_SUMMARY.md`.
2.  **`PROJECT_REVIEW.md`**: Understand *how* it is built (Architecture, RLS, Code Patterns). Located at `../overview/PROJECT_REVIEW.md`.
3.  **`ACTION_PLAN.md`**: Understand *what* to do immediately (Current Sprint). Located at `../project-management/ACTION_PLAN.md`.
4.  **`ISSUES.md`**: Specific requirements for tasks (P0 Criticals). Located at `../project-management/ISSUES.md`.
5.  **`technical/DATABASE.md`**: Database schema and RLS policies (The Law). Located at `../technical/DATABASE.md`.

---

## 🛡️ 3. Critical Rules (The "Do Not Break" List)

1.  **Security First (RLS)**:
    - NEVER disable RLS.
    - EVERY table must have policies for `select`, `insert`, `update`, `delete`.
    - ALWAYS verify tenant isolation (Trainer sees only their students; Student sees only their data).

2.  **Type Safety (Strict)**:
    - NO `any` types. Use generated types from `@/integrations/supabase/types`.
    - Fix all linting errors before finishing a task.

3.  **State Management**:
    - Use **TanStack Query** for ALL server data (fetching, caching, mutations).
    - Use `useEffect` sparingly. Prefer derived state or event handlers.
    - Explicitly handle `isLoading` and `isError` states.

4.  **UI/UX Standards**:
    - Use **shadcn/ui** components from `src/components/ui`.
    - styling MUST be **Tailwind CSS**.
    - Mobile-first: Always verify layouts on small screens (`sm:` breakpoints).

5.  **File Structure**:
    - `src/components/feature/` for domain-specific components (e.g., `src/components/workout/`).
    - `src/hooks/` for all business logic and data fetching.
    - `src/pages/` for route views only.

---

## 🛠️ 4. Tech Stack Cheatsheet

| Layer | Technology | Key Pattern |
|-------|------------|-------------|
| **DB** | Supabase (Postgres) | `supabase/migrations/*.sql` |
| **Auth** | Supabase GoTrue | `useAuthActions.ts`, `AuthContext` |
| **Data** | TanStack Query | `useQuery({ queryKey: [...] })` |
| **UI** | Tailwind + shadcn | `<Button variant="ghost" />` |
| **Icons** | Lucide React | `<Dumbbell className="w-4 h-4" />` |
| **Forms** | React Hook Form + Zod | `zodResolver(schema)` |

---

## 📍 5. Current State & Focus (Dec 2024)

**Status**: 🔴 **MVP Blocker Phase** (Week 1 of 2)

**Top Priorities (P0):**
1.  **Workout Player**: Interactive execution screen for students.
2.  **Logging Hooks**: `useWorkoutLog` mutations to save sets/reps.
3.  **Student CRUD**: Complete edition and details view.

**Reference**: See [AI_TASK_CONTEXT.md](./AI_TASK_CONTEXT.md) for the active task list.

---

## 🔄 6. Workflow for AI Agents

1.  **Read Task**: Check `ACTION_PLAN.md` for the current day's goal.
2.  **Analyze**: Read `ISSUES.md` for the specific ticket details.
3.  **Design**: Plan the component/hook structure based on `PROJECT_REVIEW.md` patterns.
4.  **Implement**: Write code (Small, atomic commits preferred).
5.  **Verify**: Run `npm run type-check` and `npm run lint`.
6.  **Update**: Mark the task as done in `ACTION_PLAN.md`.

---

**End of Guide.**
