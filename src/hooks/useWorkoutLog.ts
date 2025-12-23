import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useUpdateWorkoutLog() {
  return useMutation({
    mutationFn: async ({
      logId,
      updates,
    }: {
      logId: string;
      updates: {
        duration_minutes?: number;
        notes?: string;
        difficulty_rating?: number;
      };
    }) => {
      const { data, error } = await supabase
        .from('workout_logs')
        .update(updates)
        .eq('id', logId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// Helper hook to get current student
function useStudentRecord() {
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