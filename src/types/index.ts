// User roles
/** Represents the role of a user in the system. */
export type UserRole = 'trainer' | 'student';

// Session status
/** Represents the current status of a scheduled workout session. */
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

// Notification types
/** Represents the category of a notification. */
export type NotificationType = 'reminder' | 'feedback' | 'plan_update' | 'schedule_change';

// Muscle groups
/** Represents the primary muscle group targeted by an exercise. */
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
/** Represents the category of an exercise. */
export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'compound' | 'isolation';

// User base interface
/**
 * Base interface for all users in the system.
 */
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
/**
 * Interface representing a Personal Trainer.
 * Extends the base User interface.
 */
export interface Trainer extends User {
  role: 'trainer';
  bio?: string;
  specializations?: string[];
  active_students_count?: number;
}

// Student specific data
/**
 * Interface representing a Student (client).
 * Extends the base User interface.
 */
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
/**
 * Represents an exercise definition in the catalog.
 */
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
/**
 * Represents a workout plan designed by a trainer.
 */
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
/**
 * Represents an exercise included in a specific workout plan.
 * Contains the prescription details (sets, reps, etc.).
 */
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
/**
 * Represents a scheduled workout session for a student.
 */
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
/**
 * Represents a record of a completed or in-progress workout.
 */
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
/**
 * Represents the log data for a single set of an exercise.
 */
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
/**
 * Represents a system notification for a user.
 */
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
/**
 * Represents a user's device registered for push notifications.
 */
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
/**
 * Represents aggregate statistics for a student's performance.
 */
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

/**
 * Represents a personal record achieved by a student.
 */
export interface PersonalRecord {
  exercise_id: string;
  exercise_name: string;
  weight_kg: number;
  reps: number;
  achieved_at: string;
}

/**
 * Represents summary statistics for the trainer dashboard.
 */
export interface TrainerDashboardStats {
  total_students: number;
  active_students: number;
  sessions_today: number;
  sessions_this_week: number;
  completion_rate: number;
  pending_sessions: number;
}
