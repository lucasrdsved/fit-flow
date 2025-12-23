-- Script para configurar Row Level Security (RLS) no FitFlow
-- Execute este script no SQL Editor do painel do Supabase
-- https://supabase.com/dashboard/project/mhmadddnhyjzmzgxqpif/sql

-- Verificar se as tabelas existem antes de aplicar RLS
DO $$
BEGIN
    -- Habilitar RLS nas tabelas existentes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'students' AND table_schema = 'public') THEN
        ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workouts' AND table_schema = 'public') THEN
        ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exercises' AND table_schema = 'public') THEN
        ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workout_logs' AND table_schema = 'public') THEN
        ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'measurements' AND table_schema = 'public') THEN
        ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') THEN
        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exercise_logs' AND table_schema = 'public') THEN
        ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
    END IF;

    RAISE NOTICE 'RLS habilitado em todas as tabelas existentes';
END $$;

-- Remover políticas existentes se houver conflito
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Personal trainers can view their students" ON public.students;
DROP POLICY IF EXISTS "Personal trainers can create students" ON public.students;
DROP POLICY IF EXISTS "Personal trainers can update their students" ON public.students;
DROP POLICY IF EXISTS "Personal trainers can delete their students" ON public.students;
DROP POLICY IF EXISTS "Students can view their own data" ON public.students;

DROP POLICY IF EXISTS "Personal trainers can view their workouts" ON public.workouts;
DROP POLICY IF EXISTS "Personal trainers can create workouts" ON public.workouts;
DROP POLICY IF EXISTS "Personal trainers can update their workouts" ON public.workouts;
DROP POLICY IF EXISTS "Personal trainers can delete their workouts" ON public.workouts;
DROP POLICY IF EXISTS "Students can view their assigned workouts" ON public.workouts;

DROP POLICY IF EXISTS "Users can view exercises from accessible workouts" ON public.exercises;
DROP POLICY IF EXISTS "Personal trainers can create exercises" ON public.exercises;
DROP POLICY IF EXISTS "Personal trainers can update exercises" ON public.exercises;
DROP POLICY IF EXISTS "Personal trainers can delete exercises" ON public.exercises;

DROP POLICY IF EXISTS "Students can view their workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Personal trainers can view workout logs of their students" ON public.workout_logs;
DROP POLICY IF EXISTS "Students can create their workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Students can update their workout logs" ON public.workout_logs;

DROP POLICY IF EXISTS "Students can view exercise logs from their workout logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Personal trainers can view exercise logs of their students" ON public.exercise_logs;
DROP POLICY IF EXISTS "Students can create exercise logs for their workouts" ON public.exercise_logs;
DROP POLICY IF EXISTS "Students can update exercise logs for their workouts" ON public.exercise_logs;

DROP POLICY IF EXISTS "Students can view their measurements" ON public.measurements;
DROP POLICY IF EXISTS "Personal trainers can view measurements of their students" ON public.measurements;
DROP POLICY IF EXISTS "Students can create their measurements" ON public.measurements;
DROP POLICY IF EXISTS "Students can update their measurements" ON public.measurements;

DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON public.messages;

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
                -- Trainer owns the workout
                (EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.user_type = 'personal'
                    AND profiles.id = workouts.personal_id
                ))
                OR
                -- Student is assigned to the workout
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

-- Criar função para perfil automático se não existir
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

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_students_personal_id ON public.students(personal_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_workouts_personal_id ON public.workouts(personal_id);
CREATE INDEX IF NOT EXISTS idx_workouts_student_id ON public.workouts(student_id);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON public.exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_student_id ON public.workout_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_workout_id ON public.workout_logs(workout_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout_log_id ON public.exercise_logs(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_exercise_id ON public.exercise_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_measurements_student_id ON public.measurements(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);

-- Verificar se RLS está habilitado em todas as tabelas
DO $$
DECLARE
    table_name TEXT;
    rls_enabled BOOLEAN;
BEGIN
    FOR table_name IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('profiles', 'students', 'workouts', 'exercises', 'workout_logs', 'exercise_logs', 'measurements', 'messages')
    LOOP
        SELECT row_security INTO rls_enabled
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = table_name AND n.nspname = 'public';

        IF rls_enabled THEN
            RAISE NOTICE '✅ RLS habilitado na tabela: %', table_name;
        ELSE
            RAISE EXCEPTION '❌ RLS NÃO habilitado na tabela: %', table_name;
        END IF;
    END LOOP;

    RAISE NOTICE '🎉 Configuração de segurança RLS concluída com sucesso!';
    RAISE NOTICE '📋 Execute este script no SQL Editor do Supabase:';
    RAISE NOTICE '🔗 https://supabase.com/dashboard/project/mhmadddnhyjzmzgxqpif/sql';
END $$;
