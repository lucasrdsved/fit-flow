import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useStudentRecord, useStartWorkout, useLogSet, useFinishWorkout } from './useStudentData';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => {
  return {
    useAuth: () => ({
      user: { id: 'test-user-id', email: 'student@test.com' },
    }),
  };
});

import { supabase } from '@/integrations/supabase/client';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useStudentData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useStudentRecord', () => {
    it('should fetch student record successfully', async () => {
      const mockStudent = {
        id: 'student-id',
        name: 'Test Student',
        email: 'student@test.com',
        personal_id: 'trainer-id',
      };

      const mockFrom = {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockStudent,
              error: null,
            }),
          }),
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const { result } = renderHook(() => useStudentRecord(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockStudent);
      });

      expect(supabase.from).toHaveBeenCalledWith('students');
    });

    it('should handle no student record found', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const { result } = renderHook(() => useStudentRecord(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toBeNull();
      });
    });

    it('should handle error', async () => {
      const mockError = { message: 'Database error' };

      const mockFrom = {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const { result } = renderHook(() => useStudentRecord(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('useStartWorkout', () => {
    it('should start workout successfully', async () => {
      const mockStudent = { id: 'student-id' };
      const mockWorkoutLog = {
        id: 'workout-log-id',
        student_id: 'student-id',
        workout_id: 'workout-id',
        completed_at: new Date().toISOString(),
        duration_minutes: 0,
      };

      // Mock useStudentRecord
      vi.doMock('./useStudentData', () => ({
        useStudentRecord: () => ({ data: mockStudent }),
      }));

      const mockFrom = {
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockWorkoutLog,
              error: null,
            }),
          }),
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const { result } = renderHook(() => useStartWorkout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ workoutId: 'workout-id' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockWorkoutLog);
    });

    it('should handle error when no student found', async () => {
      // Mock useStudentRecord returning null
      vi.doMock('./useStudentData', () => ({
        useStudentRecord: () => ({ data: null }),
      }));

      const { result } = renderHook(() => useStartWorkout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ workoutId: 'workout-id' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Student not found');
    });
  });

  describe('useLogSet', () => {
    it('should log set successfully', async () => {
      const mockExerciseLog = {
        id: 'exercise-log-id',
        workout_log_id: 'workout-log-id',
        exercise_id: 'exercise-id',
        set_number: 1,
        reps: 10,
        weight: 50,
        completed: true,
      };

      const mockFrom = {
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockExerciseLog,
              error: null,
            }),
          }),
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const { result } = renderHook(() => useLogSet(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        workoutLogId: 'workout-log-id',
        exerciseId: 'exercise-id',
        setNumber: 1,
        reps: 10,
        weight: 50,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockExerciseLog);
    });
  });

  describe('useFinishWorkout', () => {
    it('should finish workout successfully', async () => {
      const mockWorkoutLog = {
        id: 'workout-log-id',
        duration_minutes: 45,
        notes: 'Good workout',
        difficulty_rating: 4,
      };

      const mockFrom = {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockWorkoutLog,
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const { result } = renderHook(() => useFinishWorkout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        logId: 'workout-log-id',
        durationMinutes: 45,
        notes: 'Good workout',
        difficulty: 4,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockWorkoutLog);
    });
  });
});
