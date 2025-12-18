// User roles
export type UserRole = 'trainer' | 'student';

// Session status
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

// Notification types
export type NotificationType = 'reminder' | 'feedback' | 'plan_update' | 'schedule_change';

// Muscle groups
export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'legs' 
  | 'glutes' 
  | 'core' 
  | 'cardio' 
  | 'full_body';

// Exercise type
export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'compound' | 'isolation';

// User base interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Trainer specific data
export interface Trainer extends User {
  role: 'trainer';
  bio?: string;
  specializations?: string[];
  active_students_count?: number;
}

// Student specific data
export interface Student extends User {
  role: 'student';
  trainer_id: string;
  phone?: string;
  birth_date?: string;
  height_cm?: number;
  weight_kg?: number;
  goals?: string;
  notes?: string;
  is_active: boolean;
}

// Exercise catalog
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_group: MuscleGroup;
  exercise_type: ExerciseType;
  instructions?: string;
  video_url?: string;
  image_url?: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

// Workout plan
export interface WorkoutPlan {
  id: string;
  trainer_id: string;
  name: string;
  description?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_min: number;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

// Plan exercise (association)
export interface PlanExercise {
  id: string;
  plan_id: string;
  exercise_id: string;
  exercise?: Exercise;
  order_index: number;
  sets: number;
  reps_min: number;
  reps_max?: number;
  rest_seconds: number;
  rpe_target?: number; // Rate of Perceived Exertion (1-10)
  rir_target?: number; // Reps in Reserve (0-5)
  notes?: string;
}

// Scheduled session
export interface Session {
  id: string;
  student_id: string;
  student?: Student;
  trainer_id: string;
  plan_id: string;
  plan?: WorkoutPlan;
  scheduled_at: string;
  status: SessionStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Workout log (header)
export interface WorkoutLog {
  id: string;
  session_id?: string;
  student_id: string;
  plan_id: string;
  started_at: string;
  completed_at?: string;
  duration_min?: number;
  notes?: string;
  rating?: number; // 1-5 workout satisfaction
  synced_at?: string;
  local_id?: string; // Client-generated UUID for offline
  version: number;
  created_at: string;
  updated_at: string;
}

// Set log (individual sets)
export interface SetLog {
  id: string;
  workout_log_id: string;
  plan_exercise_id: string;
  exercise_id: string;
  set_number: number;
  reps_completed: number;
  weight_kg?: number;
  duration_seconds?: number;
  rpe_actual?: number;
  notes?: string;
  completed_at: string;
  local_id?: string;
  version: number;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read_at?: string;
  sent_at?: string;
  created_at: string;
}

// Device (push tokens)
export interface Device {
  id: string;
  user_id: string;
  push_token: string;
  platform: 'web' | 'ios' | 'android';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Stats/Metrics types
export interface StudentStats {
  total_workouts: number;
  workouts_this_week: number;
  workouts_this_month: number;
  current_streak: number;
  longest_streak: number;
  total_volume_kg: number;
  completion_rate: number;
  personal_records: PersonalRecord[];
}

export interface PersonalRecord {
  exercise_id: string;
  exercise_name: string;
  weight_kg: number;
  reps: number;
  achieved_at: string;
}

export interface TrainerDashboardStats {
  total_students: number;
  active_students: number;
  sessions_today: number;
  sessions_this_week: number;
  completion_rate: number;
  pending_sessions: number;
}
