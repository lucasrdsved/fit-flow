# FitFlow - Fitness Management Platform

A comprehensive fitness management platform designed to streamline the interaction between personal trainers and their students.

## Features

### For Personal Trainers
- **Dashboard**: Overview of active students and recent activity.
- **Student Management**: Invite and manage students (`/trainer/students`).
- **Workout Planning**: Create reusable workout templates (`/trainer/plans`).
- **Assignment**: Assign workout plans to students with a single click.
- **Progress Tracking**: View student compliance and progress.

### For Students
- **Workout Execution**: Interactive player to guide through workouts, logging sets, reps, and weight in real-time.
- **Progress Tracking**: Visualize workout history, volume, and frequency.
- **Profile**: Manage personal goals and stats.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui.
- **Backend**: Supabase (Auth, Database, Realtime).
- **State Management**: TanStack Query.

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**: `npm install`
3.  **Start development server**: `npm run dev`

## Database Setup
This project uses Supabase. Ensure you have the following tables:
- `profiles`, `students`, `workouts`, `exercises`, `workout_logs`, `measurements`, `messages`.
- **New:** `exercise_logs` (See `supabase/migrations` for details).

## Testing
Run unit tests with:
```bash
npm run test
```
