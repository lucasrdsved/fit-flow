-- Create exercise_logs table for tracking individual sets during workouts
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_exercise_logs_workout_log_id ON public.exercise_logs(workout_log_id);
CREATE INDEX idx_exercise_logs_exercise_id ON public.exercise_logs(exercise_id);

-- Enable Row Level Security
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

-- Students can insert their own exercise logs (via workout_log ownership)
CREATE POLICY "Students can insert their own exercise logs"
ON public.exercise_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_logs wl
    JOIN public.students s ON s.id = wl.student_id
    WHERE wl.id = exercise_logs.workout_log_id
    AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);

-- Students can view their own exercise logs
CREATE POLICY "Students can view their own exercise logs"
ON public.exercise_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workout_logs wl
    JOIN public.students s ON s.id = wl.student_id
    WHERE wl.id = exercise_logs.workout_log_id
    AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);

-- Students can update their own exercise logs
CREATE POLICY "Students can update their own exercise logs"
ON public.exercise_logs
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.workout_logs wl
    JOIN public.students s ON s.id = wl.student_id
    WHERE wl.id = exercise_logs.workout_log_id
    AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);

-- Students can delete their own exercise logs
CREATE POLICY "Students can delete their own exercise logs"
ON public.exercise_logs
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.workout_logs wl
    JOIN public.students s ON s.id = wl.student_id
    WHERE wl.id = exercise_logs.workout_log_id
    AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);

-- Personal trainers can view their students' exercise logs
CREATE POLICY "Personal trainers can view student exercise logs"
ON public.exercise_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workout_logs wl
    JOIN public.students s ON s.id = wl.student_id
    WHERE wl.id = exercise_logs.workout_log_id
    AND s.personal_id = auth.uid()
  )
);