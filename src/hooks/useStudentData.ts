import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
