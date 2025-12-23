# ⚡ AI Task Context - Active Sprint

> **DYNAMIC CONTEXT**: This file represents the **CURRENT** focus of development. Agents should look here to know what to code next.

**Current Date**: 2024-12-23 (Tuesday)
**Sprint Phase**: Week 1 - Core Features (MVP)

---

## 🎯 Immediate Objective: The Student Portal

**Goal**: Make the app usable for a student to execute a workout.
**Blocker**: The `WorkoutPlayer` component and its logging hooks are missing.

---

## 📋 Active Tasks (From ACTION_PLAN.md)

### 1. Workout Player Core (Priority: P0)
- [ ] **Create Component Structure**:
    - `src/components/workout/WorkoutPlayer.tsx` (Main container)
    - `src/components/workout/ExerciseCard.tsx` (Display exercise details)
    - `src/components/workout/SetLogger.tsx` (Input weight/reps)
    - `src/components/workout/RestTimer.tsx` (Countdown)

### 2. Data Mutations (Priority: P0)
- [ ] **Implement Hooks**:
    - `src/hooks/useWorkoutLog.ts` (create/update/complete workout log)
    - `src/hooks/useExerciseLog.ts` (log sets)
    - **Requirement**: Use Optimistic Updates for snappy feel.

### 3. Error Handling (Priority: P1)
- [ ] **Safety Net**:
    - Create `src/components/ErrorBoundary.tsx`
    - Wrap `App.tsx` or main routes.

---

## 🐛 Known Constraints & Gotchas

- **Mobile Layout**: The bottom navigation bar in `StudentLayout` overlaps content on some screens. Add `padding-bottom` to your views.
- **RLS**: Remember that Students can ONLY `insert` into `workout_logs` if they own the record (`auth.uid() = student_id`).
- **Offline**: We are building a PWA. Ideally, store workout progress in `localStorage` or `IndexedDB` before syncing to Supabase to prevent data loss if network fails during a gym session.

---

## 💻 Definition of Done for Current Tasks

1.  User can open a workout.
2.  User sees the first exercise.
3.  User enters Weight/Reps and clicks "Save Set".
4.  Data persists to Supabase `exercise_logs`.
5.  Timer starts automatically.
6.  User finishes workout -> `workout_logs` marked completed.

---

**Next Action for Agent**: Start implementation of **Item 1: Workout Player Core**.
