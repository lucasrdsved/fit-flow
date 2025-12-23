import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TrainerPlans from './Plans';
import * as TrainerDataHooks from '@/hooks/useTrainerData';

// Mock the hook
vi.mock('@/hooks/useTrainerData', () => ({
  useTrainerTemplates: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TrainerPlans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (TrainerDataHooks.useTrainerTemplates as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <TrainerPlans />
      </BrowserRouter>
    );

    expect(screen.getByText(/Carregando planos/i)).toBeInTheDocument();
  });

  it('renders empty state when no plans', () => {
    (TrainerDataHooks.useTrainerTemplates as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <TrainerPlans />
      </BrowserRouter>
    );

    expect(screen.getByText(/Nenhum plano encontrado/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar Plano/i)).toBeInTheDocument();
  });

  it('renders plans list', () => {
    const mockPlans = [
      {
        id: '1',
        title: 'Hypertrophy A',
        created_at: new Date().toISOString(),
        exercises: [{}, {}, {}] // 3 exercises
      },
      {
        id: '2',
        title: 'Cardio Mix',
        created_at: new Date().toISOString(),
        exercises: [{}] // 1 exercise
      }
    ];

    (TrainerDataHooks.useTrainerTemplates as any).mockReturnValue({
      data: mockPlans,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <TrainerPlans />
      </BrowserRouter>
    );

    expect(screen.getByText('Hypertrophy A')).toBeInTheDocument();
    expect(screen.getByText('Cardio Mix')).toBeInTheDocument();
    expect(screen.getByText('3 exercícios')).toBeInTheDocument();
  });

  it('filters plans by search', () => {
    const mockPlans = [
      { id: '1', title: 'Hypertrophy', created_at: new Date().toISOString() },
      { id: '2', title: 'Cardio', created_at: new Date().toISOString() }
    ];

    (TrainerDataHooks.useTrainerTemplates as any).mockReturnValue({
      data: mockPlans,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <TrainerPlans />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar planos/i);
    fireEvent.change(searchInput, { target: { value: 'Cardio' } });

    expect(screen.queryByText('Hypertrophy')).not.toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
  });
});
