import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StudentProgress from '../Progress';
import { useStudentWorkoutLogs } from '@/hooks/useStudentData';

// Mock the hooks
vi.mock('@/hooks/useStudentData', () => ({
  useStudentWorkoutLogs: vi.fn()
}));

vi.mock('@/hooks/useAnalytics', () => ({
  useStudentAnalytics: vi.fn(() => ({
    weeklyProgress: [
      { day: 'Seg', workouts: 1, volume: 1000 },
      { day: 'Ter', workouts: 0, volume: 0 },
      { day: 'Qua', workouts: 1, volume: 1500 },
      { day: 'Qui', workouts: 0, volume: 0 },
      { day: 'Sex', workouts: 1, volume: 2000 },
      { day: 'Sáb', workouts: 0, volume: 0 },
      { day: 'Dom', workouts: 1, volume: 1800 }
    ],
    monthlyVolume: [
      { name: 'Semana 1', value: 15.2 },
      { name: 'Semana 2', value: 18.5 },
      { name: 'Semana 3', value: 22.1 },
      { name: 'Semana 4', value: 19.8 }
    ],
    personalRecords: [
      { exercise: 'Supino Reto', weight: 90, reps: 8, date: '2024-01-15' },
      { exercise: 'Agachamento', weight: 120, reps: 5, date: '2024-01-12' },
      { exercise: 'Levantamento Terra', weight: 100, reps: 3, date: '2024-01-10' }
    ],
    exerciseDistribution: [
      { name: 'Supino Reto', value: 8 },
      { name: 'Agachamento', value: 6 },
      { name: 'Levantamento Terra', value: 4 },
      { name: 'Desenvolvimento', value: 3 }
    ],
    weightProgression: [],
    adherenceData: []
  }))
}));

// Mock the charts component
vi.mock('@/components/analytics/Charts', () => ({
  ProgressLineChart: ({ title, height }: any) => (
    <div data-testid="progress-line-chart" data-height={height}>
      {title}
    </div>
  ),
  VolumeBarChart: ({ title, height }: any) => (
    <div data-testid="volume-bar-chart" data-height={height}>
      {title}
    </div>
  ),
  WeeklyActivityChart: ({ title, height }: any) => (
    <div data-testid="weekly-activity-chart" data-height={height}>
      {title}
    </div>
  ),
  PersonalRecordPieChart: ({ title, height }: any) => (
    <div data-testid="personal-record-pie-chart" data-height={height}>
      {title}
    </div>
  )
}));

// Mock LoadingSpinner
vi.mock('@/components/ui/LoadingSpinner', () => ({
  LoadingSpinner: ({ text }: any) => (
    <div data-testid="loading-spinner">{text}</div>
  )
}));

// Test wrapper
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
      }
    ]
  }
];

describe('StudentProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Carregando progresso...')).toBeInTheDocument();
  });

  it('renders progress page with charts when data is loaded', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Meu Progresso')).toBeInTheDocument();
    });

    expect(screen.getByText('Acompanhe sua evolução e conquistas')).toBeInTheDocument();
    expect(screen.getByText('Treinos')).toBeInTheDocument();
    expect(screen.getByText('Este Mês')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders weekly activity chart', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('weekly-activity-chart')).toBeInTheDocument();
      expect(screen.getByText('Atividade Semanal')).toBeInTheDocument();
    });
  });

  it('renders volume bar chart', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('volume-bar-chart')).toBeInTheDocument();
      expect(screen.getByText('Volume de Treino')).toBeInTheDocument();
    });
  });

  it('renders exercise distribution chart', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('personal-record-pie-chart')).toBeInTheDocument();
      expect(screen.getByText('Distribuição de Exercícios')).toBeInTheDocument();
    });
  });

  it('renders personal records list', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Recordes Pessoais (Top 5)')).toBeInTheDocument();
      expect(screen.getByText('Supino Reto')).toBeInTheDocument();
      expect(screen.getByText('Agachamento')).toBeInTheDocument();
      expect(screen.getByText('Levantamento Terra')).toBeInTheDocument();
    });
  });

  it('displays correct stat values', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Check that some stat values are displayed
      expect(screen.getByText((content) => content.includes('1') && content.includes('Total'))).toBeInTheDocument();
    });
  });

  it('handles empty data state', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Meu Progresso')).toBeInTheDocument();
      expect(screen.getByText('Nenhum recorde registrado ainda.')).toBeInTheDocument();
    });
  });

  it('displays error state when there is an error', () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: vi.fn()
      } as any);

    render(<StudentProgress />, { wrapper: createWrapper() });

    expect(screen.getByText('Meu Progresso')).toBeInTheDocument();
    // Should still render the component even with error
  });

  it('applies correct styling classes', async () => {
    (useStudentWorkoutLogs as vi.MockedFunction<typeof useStudentWorkoutLogs>)
      .mockReturnValue({
        data: mockWorkoutLogs,
        isLoading: false,
        error: null,
        refetch: vi.fn()
      } as any);

    const { container } = render(<StudentProgress />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('dark', 'min-h-screen', 'bg-background');
    });
  });
});