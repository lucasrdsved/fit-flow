import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { BrowserRouter } from 'react-router-dom';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
  }),
}));

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderLoginForm();
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/a senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
});
