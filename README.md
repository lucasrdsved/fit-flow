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
3.  **Configure environment variables**: Copy `env.example` to `.env` and fill in your Supabase credentials
4.  **Start development server**: `npm run dev`

## Database Setup

This project uses Supabase with Row Level Security (RLS) enabled for data protection.

### 🚨 Security Setup (CRITICAL)

**Before deploying to production, you MUST configure Row Level Security:**

1. **Execute the RLS setup script** in your Supabase SQL Editor:
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
   - Copy and paste the contents of `supabase/setup_rls.sql`
   - Run the script

This script will:
- ✅ Enable Row Level Security on all tables
- ✅ Create security policies for data access control
- ✅ Set up automatic profile creation triggers
- ✅ Create performance indexes

### Tables Structure

The database includes the following tables with RLS policies:

- `profiles` - User profiles (personal/student roles)
- `students` - Student information (trainer-owned)
- `workouts` - Workout plans and assignments
- `exercises` - Individual exercises within workouts
- `workout_logs` - Student workout completion records
- `exercise_logs` - Detailed exercise logging per set
- `measurements` - Student body measurements
- `messages` - Communication between trainers and students

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Migrations

See `supabase/migrations/` for schema definitions and RLS policies.

## Testing

Run unit tests with:

```bash
npm run test
```
