-- Enable Row Level Security (RLS) on all tables
-- This migration enables RLS and creates security policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- STUDENTS POLICIES
CREATE POLICY "Personal trainers can view their students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = students.personal_id
        )
    );

CREATE POLICY "Personal trainers can create students" ON public.students
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = students.personal_id
        )
    );

CREATE POLICY "Personal trainers can update their students" ON public.students
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = students.personal_id
        )
    );

CREATE POLICY "Personal trainers can delete their students" ON public.students
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = students.personal_id
        )
    );

CREATE POLICY "Students can view their own data" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = students.id
        )
    );

-- WORKOUTS POLICIES
CREATE POLICY "Personal trainers can view their workouts" ON public.workouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = workouts.personal_id
        )
    );

CREATE POLICY "Personal trainers can create workouts" ON public.workouts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = workouts.personal_id
        )
    );

CREATE POLICY "Personal trainers can update their workouts" ON public.workouts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = workouts.personal_id
        )
    );

CREATE POLICY "Personal trainers can delete their workouts" ON public.workouts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'personal'
            AND profiles.id = workouts.personal_id
        )
    );

CREATE POLICY "Students can view their assigned workouts" ON public.workouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = workouts.student_id
        )
    );

-- EXERCISES POLICIES
CREATE POLICY "Users can view exercises from accessible workouts" ON public.exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = exercises.workout_id
            AND (
                (EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.user_type = 'personal'
                    AND profiles.id = workouts.personal_id
                ))
                OR
                (EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.user_type = 'student'
                    AND profiles.id = workouts.student_id
                ))
            )
        )
    );

CREATE POLICY "Personal trainers can create exercises" ON public.exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = exercises.workout_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'personal'
                AND profiles.id = workouts.personal_id
            )
        )
    );

CREATE POLICY "Personal trainers can update exercises" ON public.exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = exercises.workout_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'personal'
                AND profiles.id = workouts.personal_id
            )
        )
    );

CREATE POLICY "Personal trainers can delete exercises" ON public.exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = exercises.workout_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'personal'
                AND profiles.id = workouts.personal_id
            )
        )
    );

-- WORKOUT LOGS POLICIES
CREATE POLICY "Students can view their workout logs" ON public.workout_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = workout_logs.student_id
        )
    );

CREATE POLICY "Personal trainers can view workout logs of their students" ON public.workout_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students
            WHERE students.id = workout_logs.student_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'personal'
                AND profiles.id = students.personal_id
            )
        )
    );

CREATE POLICY "Students can create their workout logs" ON public.workout_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = workout_logs.student_id
        )
    );

CREATE POLICY "Students can update their workout logs" ON public.workout_logs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = workout_logs.student_id
        )
    );

-- EXERCISE LOGS POLICIES
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

-- MEASUREMENTS POLICIES
CREATE POLICY "Students can view their measurements" ON public.measurements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = measurements.student_id
        )
    );

CREATE POLICY "Personal trainers can view measurements of their students" ON public.measurements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students
            WHERE students.id = measurements.student_id
            AND EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.user_type = 'personal'
                AND profiles.id = students.personal_id
            )
        )
    );

CREATE POLICY "Students can create their measurements" ON public.measurements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = measurements.student_id
        )
    );

CREATE POLICY "Students can update their measurements" ON public.measurements
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = measurements.student_id
        )
    );

-- MESSAGES POLICIES
CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Trigger para criação automática de perfil (se não existir)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
