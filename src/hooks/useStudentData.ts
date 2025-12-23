import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to fetch the current student's record based on the authenticated user's email.
 *
 * @returns {object} The query result containing the student record, loading state, and error.
 */
export function useStudentRecord() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-record', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });
}

/**
 * Custom hook to fetch the current student's workouts.
 *
 * This hook depends on `useStudentRecord` to get the student's ID.
 *
 * @returns {object} The query result containing the list of workouts, loading state, and error.
 */
export function useStudentWorkouts() {
  const { data: student } = useStudentRecord();

  return useQuery({
    queryKey: ['student-workouts', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (*)
        `)
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!student?.id,
  });
}

/**
 * Custom hook to fetch the current student's workout logs.
 *
 * Fetches the 10 most recent workout logs for the student.
 *
 * @returns {object} The query result containing the workout logs, loading state, and error.
 */
export function useStudentWorkoutLogs() {
  const { data: student } = useStudentRecord();

  return useQuery({
    queryKey: ['student-workout-logs', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      const { data, error } = await supabase
        .from('workout_logs')
        .select(`
          *,
          workouts (title, workout_type)
        `)
        .eq('student_id', student.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!student?.id,
  });
}

/**
 * Custom hook to fetch the current student's measurements.
 *
 * Fetches the 10 most recent measurements for the student.
 *
 * @returns {object} The query result containing the measurements, loading state, and error.
 */
export function useStudentMeasurements() {
  const { data: student } = useStudentRecord();

  return useQuery({
    queryKey: ['student-measurements', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('student_id', student.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!student?.id,
  });
}
