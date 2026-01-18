-- Create messages table for trainer-student communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'workout_feedback', 'system')),
    workout_log_id UUID REFERENCES workout_logs(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_workout_log ON messages(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update read status of received messages" ON messages
    FOR UPDATE USING (
        auth.uid() = receiver_id
    ) WITH CHECK (
        auth.uid() = receiver_id
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- Insert some sample messages (for testing)
INSERT INTO messages (sender_id, receiver_id, content, message_type) VALUES
    ((SELECT id FROM auth.users WHERE email = 'trainer@example.com' LIMIT 1), 
     (SELECT id FROM auth.users WHERE email = 'student@example.com' LIMIT 1), 
     'Olá! Como foi o treino de hoje?', 'text'),
    ((SELECT id FROM auth.users WHERE email = 'student@example.com' LIMIT 1), 
     (SELECT id FROM auth.users WHERE email = 'trainer@example.com' LIMIT 1), 
     'Foi ótimo! Consegui completar todas as séries.', 'text'),
    ((SELECT id FROM auth.users WHERE email = 'trainer@example.com' LIMIT 1), 
     (SELECT id FROM auth.users WHERE email = 'student@example.com' LIMIT 1), 
     'Excelente! Continue assim!', 'text');

-- Create notifications table for push notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'workout_reminder', 'achievement', 'message', 'system')),
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Create function to handle new workout log notifications
CREATE OR REPLACE FUNCTION notify_workout_completion()
RETURNS TRIGGER AS $$
DECLARE
    student_profile RECORD;
    trainer_id UUID;
BEGIN
    -- Get student profile and trainer info
    SELECT s.*, w.trainer_id INTO student_profile
    FROM students s
    JOIN workouts w ON w.student_id = s.id
    WHERE s.id = NEW.student_id
    LIMIT 1;
    
    IF FOUND AND student_profile.trainer_id IS NOT NULL THEN
        -- Notify trainer about workout completion
        INSERT INTO notifications (user_id, title, body, type, data)
        VALUES (
            student_profile.trainer_id,
            'Treino Concluído!',
            student_profile.name || ' completou um treino.',
            'workout_reminder',
            jsonb_build_object(
                'student_id', student_profile.id,
                'workout_log_id', NEW.id,
                'workout_id', NEW.workout_id
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for workout completion notifications
DROP TRIGGER IF EXISTS notify_workout_completion_trigger ON workout_logs;
CREATE TRIGGER notify_workout_completion_trigger
    AFTER INSERT OR UPDATE ON workout_logs
    FOR EACH ROW
    WHEN (OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL)
    EXECUTE FUNCTION notify_workout_completion();