import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SignUpForm } from './SignUpForm';
import { BrowserRouter } from 'react-router-dom';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: vi.fn(),
  }),
}));

const renderSignUpForm = () => {
  return render(
    <BrowserRouter>
      <SignUpForm />
    </BrowserRouter>
  );
};

describe('SignUpForm', () => {
  it('renders all fields', () => {
    renderSignUpForm();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sou professor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sou aluno/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderSignUpForm();
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/a senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    renderSignUpForm();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
});
