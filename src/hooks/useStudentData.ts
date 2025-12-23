import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useStartWorkout() {
  const { data: student } = useStudentRecord();

  return useMutation({
    mutationFn: async ({ workoutId }: { workoutId: string }) => {
      if (!student?.id) throw new Error('Student not found');

      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          student_id: student.id,
          workout_id: workoutId,
          completed_at: new Date().toISOString(), // Using as start time effectively
          duration_minutes: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useLogSet() {
  return useMutation({
    mutationFn: async ({
      workoutLogId,
      exerciseId,
      setNumber,
      reps,
      weight,
    }: {
      workoutLogId: string;
      exerciseId: string;
      setNumber: number;
      reps: number;
      weight: number;
    }) => {
      const { data, error } = await supabase
        .from('exercise_logs')
        .insert({
          workout_log_id: workoutLogId,
          exercise_id: exerciseId,
          set_number: setNumber,
          reps,
          weight,
          completed: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useFinishWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logId,
      durationMinutes,
      notes,
      difficulty,
    }: {
      logId: string;
      durationMinutes: number;
      notes?: string;
      difficulty?: number;
    }) => {
      const { data, error } = await supabase
        .from('workout_logs')
        .update({
          duration_minutes: durationMinutes,
          notes,
          difficulty_rating: difficulty,
          completed_at: new Date().toISOString(), // Update to actual finish time
        })
        .eq('id', logId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-workout-logs'] });
    },
  });
}

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
        .select(
          `
          *,
          exercises (*)
        `,
        )
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
        .select(
          `
          *,
          workouts (title, workout_type),
          exercise_logs (
            reps,
            weight,
            completed,
            exercises (name)
          )
        `,
        )
        .eq('student_id', student.id)
        .order('completed_at', { ascending: false })
        .limit(20);

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
