# Database Schema & Policies

## Overview
The database is hosted on **Supabase (PostgreSQL)**. It uses a normalized schema with strict foreign key constraints and Row Level Security (RLS) to ensure multi-tenant data isolation.

## Tables

### `profiles`
**Purpose:** Extends the standard `auth.users` table with application-specific user data.
- `id`: UUID (PK, FK to `auth.users`)
- `user_type`: Enum ('personal', 'student') - **Critical for RBAC**
- `name`: Text

### `students`
**Purpose:** Represents the relationship between a Personal Trainer and a Client.
- `id`: UUID (PK)
- `personal_id`: UUID (FK to `profiles`) - The trainer who owns this record.
- `email`: Text (Unique) - Used to link to the `auth.users` account.
- **Security:** Trainers can full CRUD. Students can only Read.

### `workouts`
**Purpose:** A workout plan assigned to a student.
- `personal_id`: UUID (FK to `profiles`) - Creator/Owner.
- `student_id`: UUID (FK to `students`) - Assignee.
- **Security:** Trainers Full CRUD. Students Read Only.

### `exercises`
**Purpose:** Individual exercises within a workout.
- `workout_id`: UUID (FK to `workouts`)
- `order_index`: Integer - For custom sorting.

### `workout_logs`
**Purpose:** A record of a student performing a workout.
- `student_id`: UUID (FK to `students`)
- `workout_id`: UUID (FK to `workouts`)
- `completed_at`: Timestamp
- **Security:** Students can Insert/Update their own logs. Trainers can Read logs of their students.

### `exercise_logs`
**Purpose:** Detailed data for each set performed in a workout log.
- `workout_log_id`: UUID (FK to `workout_logs`)
- `reps`, `weight`, `completed`: Performance data.

### `measurements`
**Purpose:** Body metrics tracking.
- `student_id`: UUID (FK to `students`)
- **Security:** Students can Insert/Read. Trainers can Read their students' measurements.

## Security Model (RLS)

**The Golden Rule:** Frontend checks are for UX; Database policies are for Security.

### Policy Patterns
1. **Trainers:**
   - Can access data where `auth.uid() == personal_id`.
   - Can access sub-resources (like `exercises`) if they own the parent resource.
2. **Students:**
   - Can access data where `auth.uid() == id` (for their profile/student record).
   - Can access data where `student_id` matches their ID.
   - Can generally **not** delete data assigned to them by trainers (like Workouts), only read it.

## Common Queries & Indexes
Indexes are established on all Foreign Keys to ensure performance for:
- Fetching all students for a trainer (`WHERE personal_id = ?`)
- Fetching all workouts for a student (`WHERE student_id = ?`)
- Fetching logs for a workout (`WHERE workout_id = ?`)
