import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { offlineStorage, WorkoutData, ExerciseData, SetData } from '@/lib/offlineStorage';
import { useOfflineStorage } from '@/lib/offlineStorage';

export function useStartWorkout() {
  const { data: student } = useStudentRecord();
  const { isOnline, offlineStorage } = useOfflineStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workoutId }: { workoutId: string }) => {
      if (!student?.id) throw new Error('Student not found');

      const workoutData: WorkoutData = {
        id: crypto.randomUUID(),
        student_id: student.id,
        workout_id: workoutId,
        exercises: [],
        completed_at: new Date().toISOString(),
        duration_minutes: 0,
        isOffline: !isOnline
      };

      if (isOnline) {
        // Try to save to server first
        try {
          const { data, error } = await supabase
            .from('workout_logs')
            .insert({
              student_id: student.id,
              workout_id: workoutId,
              completed_at: workoutData.completed_at,
              duration_minutes: 0,
            })
            .select()
            .single();

          if (error) throw error;
          
          // Also save to offline storage for backup
          await offlineStorage.storeWorkoutData(workoutData);
          return data;
        } catch (error) {
          console.error('[StudentData] Server save failed, using offline mode:', error);
        }
      }

      // Save to offline storage
      await offlineStorage.storeWorkoutData(workoutData);
      
      // Add to sync queue
      await offlineStorage.addToSyncQueue({
        type: 'workout',
        action: 'create',
        data: workoutData
      });

      return workoutData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-workout-logs'] });
    },
  });
}

export function useLogSet() {
  const { isOnline, offlineStorage } = useOfflineStorage();
  const queryClient = useQueryClient();

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
      const setData: SetData = {
        exercise_id: exerciseId,
        set_number: setNumber,
        reps,
        weight,
        completed: true,
        timestamp: Date.now()
      };

      if (isOnline) {
        try {
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
          
          // Also save to offline storage
          await offlineStorage.storeSetData(setData);
          return data;
        } catch (error) {
          console.error('[StudentData] Server save failed, using offline mode:', error);
        }
      }

      // Save to offline storage
      const savedSetId = await offlineStorage.storeSetData(setData);
      
      // Add to sync queue
      await offlineStorage.addToSyncQueue({
        type: 'exercise',
        action: 'create',
        data: { ...setData, workout_log_id: workoutLogId, id: savedSetId }
      });

      return { ...setData, id: savedSetId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-workout-logs'] });
    },
  });
}

export function useFinishWorkout() {
  const { isOnline, offlineStorage } = useOfflineStorage();
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
      const updateData = {
        duration_minutes: durationMinutes,
        notes,
        difficulty_rating: difficulty,
        completed_at: new Date().toISOString(),
      };

      if (isOnline) {
        try {
          const { data, error } = await supabase
            .from('workout_logs')
            .update(updateData)
            .eq('id', logId)
            .select()
            .single();

          if (error) throw error;
          
          // Update offline storage as well
          const workoutData = await offlineStorage.getWorkoutData(logId);
          if (workoutData) {
            await offlineStorage.storeWorkoutData({
              ...workoutData,
              ...updateData
            });
          }
          
          return data;
        } catch (error) {
          console.error('[StudentData] Server update failed, using offline mode:', error);
        }
      }

      // Update offline storage
      const workoutData = await offlineStorage.getWorkoutData(logId);
      if (workoutData) {
        await offlineStorage.storeWorkoutData({
          ...workoutData,
          ...updateData
        });
      }
      
      // Add to sync queue
      await offlineStorage.addToSyncQueue({
        type: 'workout',
        action: 'update',
        data: { id: logId, ...updateData }
      });

      return { id: logId, ...updateData };
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
  const { isOnline, offlineStorage } = useOfflineStorage();

  return useQuery({
    queryKey: ['student-workouts', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      if (isOnline) {
        try {
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
          
          // Cache the response
          const workouts = data || [];
          await offlineStorage.cacheApiResponse(
            `/workouts/student/${student.id}`,
            workouts,
            300000 // 5 minutes
          );
          
          return workouts;
        } catch (error) {
          console.error('[StudentData] Server fetch failed, trying cache:', error);
        }
      }

      // Try to get cached data
      try {
        const cachedData = await offlineStorage.getCachedApiResponse(`/workouts/student/${student.id}`);
        if (cachedData) {
          return cachedData;
        }
      } catch (error) {
        console.error('[StudentData] Cache fetch failed:', error);
      }

      return [];
    },
    enabled: !!student?.id,
    staleTime: 300000, // 5 minutes
  });
}

export function useStudentWorkoutLogs() {
  const { data: student } = useStudentRecord();
  const { isOnline, offlineStorage } = useOfflineStorage();

  return useQuery({
    queryKey: ['student-workout-logs', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      let serverLogs: any[] = [];

      if (isOnline) {
        try {
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
          serverLogs = data || [];
          
          // Cache the response
          await offlineStorage.cacheApiResponse(
            `/workout-logs/student/${student.id}`,
            serverLogs,
            300000 // 5 minutes
          );
        } catch (error) {
          console.error('[StudentData] Server fetch failed, trying cache:', error);
          
          // Try to get cached data
          try {
            const cachedData = await offlineStorage.getCachedApiResponse(`/workout-logs/student/${student.id}`);
            if (cachedData) {
              serverLogs = cachedData;
            }
          } catch (cacheError) {
            console.error('[StudentData] Cache fetch failed:', cacheError);
          }
        }
      } else {
        // Offline - try cache first
        try {
          const cachedData = await offlineStorage.getCachedApiResponse(`/workout-logs/student/${student.id}`);
          if (cachedData) {
            serverLogs = cachedData;
          }
        } catch (error) {
          console.error('[StudentData] Cache fetch failed:', error);
        }
      }

      // Get offline workout logs
      try {
        const offlineWorkouts = await offlineStorage.getAllWorkoutData(student.id);
        
        // Merge offline and server data, prioritizing server data
        const mergedLogs = [...serverLogs];
        
        offlineWorkouts.forEach(offlineWorkout => {
          const existsInServer = serverLogs.some(log => log.id === offlineWorkout.id);
          if (!existsInServer) {
            mergedLogs.unshift({
              ...offlineWorkout,
              workouts: { title: 'Offline Workout', workout_type: 'offline' },
              exercise_logs: [],
              isOffline: true
            });
          }
        });

        return mergedLogs.slice(0, 20);
      } catch (error) {
        console.error('[StudentData] Failed to merge offline data:', error);
        return serverLogs;
      }
    },
    enabled: !!student?.id,
    staleTime: 300000, // 5 minutes
  });
}

export function useStudentMeasurements() {
  const { data: student } = useStudentRecord();
  const { isOnline, offlineStorage } = useOfflineStorage();

  return useQuery({
    queryKey: ['student-measurements', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];

      if (isOnline) {
        try {
          const { data, error } = await supabase
            .from('measurements')
            .select('*')
            .eq('student_id', student.id)
            .order('date', { ascending: false })
            .limit(10);

          if (error) throw error;
          
          // Cache the response
          const measurements = data || [];
          await offlineStorage.cacheApiResponse(
            `/measurements/student/${student.id}`,
            measurements,
            600000 // 10 minutes
          );
          
          return measurements;
        } catch (error) {
          console.error('[StudentData] Server fetch failed, trying cache:', error);
        }
      }

      // Try to get cached data
      try {
        const cachedData = await offlineStorage.getCachedApiResponse(`/measurements/student/${student.id}`);
        if (cachedData) {
          return cachedData;
        }
      } catch (error) {
        console.error('[StudentData] Cache fetch failed:', error);
      }

      return [];
    },
    enabled: !!student?.id,
    staleTime: 600000, // 10 minutes
  });
}

// Hook for offline sync management
export function useOfflineSync() {
  const { isOnline, offlineStorage } = useOfflineStorage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [pendingItems, setPendingItems] = useState(0);

  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const items = await offlineStorage.getSyncQueueItems();
        setPendingItems(items.length);
      } catch (error) {
        console.error('[OfflineSync] Failed to get pending items:', error);
      }
    };

    updatePendingCount();
    
    // Check pending items every 30 seconds
    const interval = setInterval(updatePendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const triggerSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      const items = await offlineStorage.getSyncQueueItems();
      
      for (const item of items) {
        try {
          // Sync logic would go here
          // This would depend on your API endpoints for syncing
          console.log('[OfflineSync] Syncing item:', item);
          
          // Remove from queue after successful sync
          await offlineStorage.removeSyncQueueItem(item.id);
        } catch (error) {
          console.error('[OfflineSync] Failed to sync item:', item.id, error);
          
          // Update retry count
          await offlineStorage.updateSyncQueueRetryCount(item.id);
          
          // Remove if too many retries
          if ((item.retryCount || 0) >= 3) {
            await offlineStorage.removeSyncQueueItem(item.id);
          }
        }
      }

      // Update pending count
      const remainingItems = await offlineStorage.getSyncQueueItems();
      setPendingItems(remainingItems.length);
      
    } catch (error) {
      setSyncError('Sync failed. Please try again.');
      console.error('[OfflineSync] Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, offlineStorage]);

  return {
    isSyncing,
    syncError,
    pendingItems,
    triggerSync
  };
}
