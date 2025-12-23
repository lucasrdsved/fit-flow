-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('personal', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create students table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    birth_date DATE,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    goal TEXT,
    restrictions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Students policies (trainers can only see their own students)
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

-- Students can view their own data
CREATE POLICY "Students can view their own data" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = students.id
        )
    );

-- Create workouts table
CREATE TABLE public.workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    workout_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Workouts policies
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

-- Students can view their assigned workouts
CREATE POLICY "Students can view their assigned workouts" ON public.workouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = workouts.student_id
        )
    );

-- Create exercises table
CREATE TABLE public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps TEXT NOT NULL,
    rest_time INTEGER,
    notes TEXT,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Exercises policies (inherit permissions from workouts)
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

-- Create workout_logs table
CREATE TABLE public.workout_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    duration_minutes INTEGER,
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    notes TEXT
);

-- Enable RLS on workout_logs
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Workout logs policies
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

-- Create measurements table
CREATE TABLE public.measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    body_fat DECIMAL(4,2),
    arm_left DECIMAL(5,2),
    arm_right DECIMAL(5,2),
    chest DECIMAL(5,2),
    waist DECIMAL(5,2),
    hip DECIMAL(5,2),
    thigh_left DECIMAL(5,2),
    thigh_right DECIMAL(5,2),
    calf_left DECIMAL(5,2),
    calf_right DECIMAL(5,2),
    photos TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on measurements
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- Measurements policies
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

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies (users can only see messages they sent or received)
CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Create function to handle profile creation on user signup
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

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_students_personal_id ON public.students(personal_id);
CREATE INDEX idx_students_email ON public.students(email);
CREATE INDEX idx_workouts_personal_id ON public.workouts(personal_id);
CREATE INDEX idx_workouts_student_id ON public.workouts(student_id);
CREATE INDEX idx_exercises_workout_id ON public.exercises(workout_id);
CREATE INDEX idx_workout_logs_student_id ON public.workout_logs(student_id);
CREATE INDEX idx_workout_logs_workout_id ON public.workout_logs(workout_id);
CREATE INDEX idx_measurements_student_id ON public.measurements(student_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
