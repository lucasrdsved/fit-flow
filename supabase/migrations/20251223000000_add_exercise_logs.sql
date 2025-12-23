-- Enable RLS on exercise_logs (if not already enabled)
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

-- Exercise logs policies
CREATE POLICY "Students can view exercise logs from their workout logs" ON public.exercise_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_logs
            WHERE workout_logs.id = exercise_logs.workout_log_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'student'
                AND profiles.id = workout_logs.student_id
            )
        )
    );

CREATE POLICY "Personal trainers can view exercise logs of their students" ON public.exercise_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_logs
            WHERE workout_logs.id = exercise_logs.workout_log_id
            AND EXISTS (
                SELECT 1 FROM public.students
                WHERE students.id = workout_logs.student_id
                AND EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.user_type = 'personal'
                    AND profiles.id = students.personal_id
                )
            )
        )
    );

CREATE POLICY "Students can create exercise logs for their workouts" ON public.exercise_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_logs
            WHERE workout_logs.id = exercise_logs.workout_log_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'student'
                AND profiles.id = workout_logs.student_id
            )
        )
    );

CREATE POLICY "Students can update exercise logs for their workouts" ON public.exercise_logs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_logs
            WHERE workout_logs.id = exercise_logs.workout_log_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'student'
                AND profiles.id = workout_logs.student_id
            )
        )
    );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout_log_id ON public.exercise_logs(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_exercise_id ON public.exercise_logs(exercise_id);
