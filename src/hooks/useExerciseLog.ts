import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export function useUpdateExerciseSet() {
  return useMutation({
    mutationFn: async ({
      setId,
      updates,
    }: {
      setId: string;
      updates: {
        reps?: number;
        weight?: number;
        completed?: boolean;
      };
    }) => {
      const { data, error } = await supabase
        .from('exercise_logs')
        .update(updates)
        .eq('id', setId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteExerciseSet() {
  return useMutation({
    mutationFn: async (setId: string) => {
      const { error } = await supabase
        .from('exercise_logs')
        .delete()
        .eq('id', setId);

      if (error) throw error;
      return setId;
    },
  });
}

export function useWorkoutLogSets(workoutLogId: string) {
  return useQuery({
    queryKey: ['workout-log-sets', workoutLogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_logs')
        .select(`
          *,
          exercises (
            name
          )
        `)
        .eq('workout_log_id', workoutLogId)
        .order('set_number');

      if (error) throw error;
      return data || [];
    },
    enabled: !!workoutLogId,
  });
}