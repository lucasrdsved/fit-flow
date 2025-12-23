# Implementation Notes - FitFlow 2.0

## Database Schema Changes
To support granular progress tracking, we have introduced a new table `exercise_logs`.

### `exercise_logs`
Stores the actual performance of a student for a specific exercise set.

- `id`: UUID (PK)
- `workout_log_id`: UUID (FK to `workout_logs`)
- `exercise_id`: UUID (FK to `exercises`)
- `set_number`: Integer
- `reps`: Integer
- `weight`: Numeric
- `completed`: Boolean
- `created_at`: Timestamp

**SQL Migration:**
See `supabase/migrations/20251223000000_add_exercise_logs.sql`.

## Logic Flow

### Trainer Workflow
1.  **Create Student:** Trainer adds a student via `/trainer/students/new`.
2.  **Create Plan:** Trainer creates a "Template Workout" (a workout with `student_id = null`) via `/trainer/plans`.
3.  **Assign Plan:** In `/trainer/students/:id`, the trainer selects a template. The system clones the template (creates a new `workout` linked to the student and copies all `exercises`).

### Student Workflow
1.  **Start Workout:** Student selects an assigned workout. A new `workout_logs` entry is created with `completed_at` (acting as start time) and `duration = 0`.
2.  **Log Sets:** As the student completes sets, `exercise_logs` are inserted immediately.
3.  **Finish Workout:** Student clicks finish. The `workout_logs` entry is updated with the final `duration_minutes` and `completed_at` timestamp.

## Missing Features / Future Work
- **Edit Assigned Workout:** Currently, once assigned, the workout is static. Trainers cannot "update" an assigned workout easily without deleting and re-assigning.
- **Charts:** "Muscle Group Distribution" is currently not implemented due to lack of `muscle_group` data in the `exercises` table.
- **In-Progress Recovery:** If a student refreshes the page during a workout, they must select the workout again. It will create a new log entry. Logic to resume the last open log could be added.
