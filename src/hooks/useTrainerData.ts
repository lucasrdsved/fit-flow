import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useTrainerStudents() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trainer-students', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('personal_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useTrainerWorkouts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trainer-workouts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          students (name, email),
          exercises (*)
        `)
        .eq('personal_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useTrainerTemplates() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trainer-templates', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (*)
        `)
        .eq('personal_id', user.id)
        .is('student_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useCreateStudent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: {
      name: string;
      email: string;
      phone?: string;
      goal?: string;
      birth_date?: string;
      height?: number;
      weight?: number;
      restrictions?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('students')
        .insert({
          ...studentData,
          personal_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-students'] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      name?: string;
      email?: string;
      phone?: string;
      goal?: string;
      birth_date?: string;
      height?: number;
      weight?: number;
      restrictions?: string;
    }) => {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-students'] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-students'] });
    },
  });
}

export function useCreateWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutData: {
      title: string;
      description?: string;
      student_id?: string;
      workout_type?: string;
      exercises?: Array<{
        name: string;
        sets: number;
        reps: string;
        rest_time?: number;
        notes?: string;
        video_url?: string;
        order_index: number;
      }>;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { exercises, ...workoutOnly } = workoutData;

      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          ...workoutOnly,
          personal_id: user.id,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      if (exercises && exercises.length > 0) {
        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(
            exercises.map(ex => ({
              ...ex,
              workout_id: workout.id,
            }))
          );

        if (exercisesError) throw exercisesError;
      }

      return workout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-workouts'] });
    },
  });
}

export function useTrainerStudent(studentId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trainer-student', studentId],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .eq('personal_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!studentId,
  });
}

export function useAssignWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, templateId }: { studentId: string; templateId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // 1. Fetch template and exercises
      const { data: template, error: templateError } = await supabase
        .from('workouts')
        .select(`*, exercises(*)`)
        .eq('id', templateId)
        .single();

      if (templateError || !template) throw new Error('Template not found');

      // 2. Create new workout for student
      const { data: newWorkout, error: createError } = await supabase
        .from('workouts')
        .insert({
          title: template.title,
          description: template.description,
          workout_type: template.workout_type,
          personal_id: user.id,
          student_id: studentId,
        })
        .select()
        .single();

      if (createError) throw createError;

      // 3. Copy exercises
      if (template.exercises && template.exercises.length > 0) {
        const exercisesToInsert = template.exercises.map(ex => ({
          workout_id: newWorkout.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest_time: ex.rest_time,
          notes: ex.notes,
          video_url: ex.video_url,
          order_index: ex.order_index,
        }));

        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert);

        if (exercisesError) throw exercisesError;
      }

      return newWorkout;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainer-workouts'] });
      // Invalidate student specific queries if we had them scoped by student
    },
  });
}

export function useTrainerStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trainer-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('personal_id', user.id);

      // Get workouts count
      const { count: workoutsCount } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('personal_id', user.id);

      // Get recent workout logs for completion rate
      const { data: recentLogs } = await supabase
        .from('workout_logs')
        .select('*, students!inner(personal_id)')
        .eq('students.personal_id', user.id)
        .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      return {
        studentsCount: studentsCount || 0,
        workoutsCount: workoutsCount || 0,
        weeklyCompletions: recentLogs?.length || 0,
      };
    },
    enabled: !!user?.id,
  });
}
