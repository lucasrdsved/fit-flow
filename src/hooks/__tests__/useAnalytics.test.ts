import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudentAnalytics } from '../useAnalytics';

// Mock data for testing
const mockWorkoutLogs = [
  {
    id: '1',
    completed_at: '2024-01-15T10:00:00Z',
    duration_minutes: 45,
    difficulty_rating: 4,
    exercise_logs: [
      {
        reps: 10,
        weight: 80,
        completed: true,
        exercises: { name: 'Supino Reto' }
      },
      {
        reps: 12,
        weight: 60,
        completed: true,
        exercises: { name: 'Agachamento' }
      }
    ]
  },
  {
    id: '2',
    completed_at: '2024-01-12T14:30:00Z',
    duration_minutes: 50,
    difficulty_rating: 5,
    exercise_logs: [
      {
        reps: 8,
        weight: 90,
        completed: true,
        exercises: { name: 'Supino Reto' }
      }
    ]
  },
  {
    id: '3',
    completed_at: '2024-01-10T09:15:00Z',
    duration_minutes: 40,
    difficulty_rating: 3,
    exercise_logs: [
      {
        reps: 15,
        weight: 40,
        completed: true,
        exercises: { name: 'Agachamento' }
      }
    ]
  }
];

// Create a wrapper for React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useStudentAnalytics', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return empty arrays when no logs provided', () => {
    const { result } = renderHook(() => useStudentAnalytics([]), {
      wrapper: createWrapper()
    });

    expect(result.current).toEqual({
      weeklyProgress: [],
      monthlyVolume: [],
      personalRecords: [],
      weightProgression: [],
      exerciseDistribution: [],
      adherenceData: []
    });
  });

  it('should return null logs when logs are null or undefined', () => {
    const { result } = renderHook(() => useStudentAnalytics(null as any), {
      wrapper: createWrapper()
    });

    expect(result.current).toEqual({
      weeklyProgress: [],
      monthlyVolume: [],
      personalRecords: [],
      weightProgression: [],
      exerciseDistribution: [],
      adherenceData: []
    });
  });

  it('should calculate weekly progress correctly', () => {
    const { result } = renderHook(() => useStudentAnalytics(mockWorkoutLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.weeklyProgress).toHaveLength(7); // Should have 7 days
    expect(result.current.weeklyProgress[0]).toHaveProperty('day');
    expect(result.current.weeklyProgress[0]).toHaveProperty('workouts');
    expect(result.current.weeklyProgress[0]).toHaveProperty('volume');
  });

  it('should calculate personal records correctly', () => {
    const { result } = renderHook(() => useStudentAnalytics(mockWorkoutLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.personalRecords).toHaveLength(2); // Should have 2 exercises with records
    expect(result.current.personalRecords[0]).toEqual(
      expect.objectContaining({
        exercise: 'Supino Reto',
        weight: 90,
        reps: 8
      })
    );
    expect(result.current.personalRecords[1]).toEqual(
      expect.objectContaining({
        exercise: 'Agachamento',
        weight: 60,
        reps: 12
      })
    );
  });

  it('should calculate exercise distribution correctly', () => {
    const { result } = renderHook(() => useStudentAnalytics(mockWorkoutLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.exerciseDistribution).toHaveLength(2);
    expect(result.current.exerciseDistribution[0]).toEqual(
      expect.objectContaining({
        name: 'Agachamento',
        value: 2 // Should appear in 2 workouts
      })
    );
    expect(result.current.exerciseDistribution[1]).toEqual(
      expect.objectContaining({
        name: 'Supino Reto',
        value: 2 // Should appear in 2 workouts
      })
    );
  });

  it('should sort personal records by weight in descending order', () => {
    const { result } = renderHook(() => useStudentAnalytics(mockWorkoutLogs), {
      wrapper: createWrapper()
    });

    // First record should be the heaviest
    expect(result.current.personalRecords[0].weight).toBeGreaterThanOrEqual(
      result.current.personalRecords[1].weight
    );
  });

  it('should handle incomplete exercise data', () => {
    const incompleteLogs = [
      {
        id: '1',
        completed_at: '2024-01-15T10:00:00Z',
        duration_minutes: 45,
        exercise_logs: [
          {
            reps: 10,
            weight: 80,
            completed: true
            // Missing exercises.name
          }
        ]
      }
    ];

    const { result } = renderHook(() => useStudentAnalytics(incompleteLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.personalRecords).toHaveLength(1);
    expect(result.current.personalRecords[0].exercise).toBe('Exercício');
  });

  it('should handle zero weight exercises', () => {
    const zeroWeightLogs = [
      {
        id: '1',
        completed_at: '2024-01-15T10:00:00Z',
        duration_minutes: 45,
        exercise_logs: [
          {
            reps: 10,
            weight: 0,
            completed: true,
            exercises: { name: 'Flexão' }
          }
        ]
      }
    ];

    const { result } = renderHook(() => useStudentAnalytics(zeroWeightLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.personalRecords).toHaveLength(0); // Should not include zero weight
  });

  it('should handle incomplete sets', () => {
    const incompleteSetLogs = [
      {
        id: '1',
        completed_at: '2024-01-15T10:00:00Z',
        duration_minutes: 45,
        exercise_logs: [
          {
            reps: 10,
            weight: 80,
            completed: false, // Not completed
            exercises: { name: 'Supino Reto' }
          }
        ]
      }
    ];

    const { result } = renderHook(() => useStudentAnalytics(incompleteSetLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.personalRecords).toHaveLength(0); // Should not include incomplete sets
  });

  it('should limit personal records to top 5', () => {
    const manyRecordsLogs = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      completed_at: `2024-01-${15 - i}T10:00:00Z`,
      duration_minutes: 45,
      exercise_logs: [
        {
          reps: 10,
          weight: 80 + i,
          completed: true,
          exercises: { name: `Exercício ${i + 1}` }
        }
      ]
    }));

    const { result } = renderHook(() => useStudentAnalytics(manyRecordsLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.personalRecords).toHaveLength(5); // Should be limited to 5
  });

  it('should calculate volume in tons for large volumes', () => {
    const highVolumeLogs = [
      {
        id: '1',
        completed_at: '2024-01-15T10:00:00Z',
        duration_minutes: 45,
        exercise_logs: [
          {
            reps: 10,
            weight: 200,
            completed: true,
            exercises: { name: 'Exercício Pesado' }
          }
        ]
      }
    ];

    const { result } = renderHook(() => useStudentAnalytics(highVolumeLogs), {
      wrapper: createWrapper()
    });

    expect(result.current.monthlyVolume[0].value).toBeGreaterThan(0);
  });

  it('should memoize results properly', () => {
    const { result, rerender } = renderHook(
      (logs: any[] = mockWorkoutLogs) => useStudentAnalytics(logs),
      {
        wrapper: createWrapper()
      }
    );

    const firstResult = result.current;
    
    // Rerender with same data
    rerender(mockWorkoutLogs);
    
    expect(result.current).toBe(firstResult); // Should be memoized
  });
});