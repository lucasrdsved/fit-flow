import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SignUpForm } from './SignUpForm';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderSignUpForm = (signUpMock = vi.fn()) => {
  vi.mocked(useAuth).mockReturnValue({
    signUp: signUpMock,
    user: null,
    session: null,
    profile: null,
    userType: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    mockLogin: vi.fn(),
  });
  
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

  it('calls signUp with correct values on valid submit', async () => {
    const signUpMock = vi.fn().mockResolvedValue({ error: null });
    renderSignUpForm(signUpMock);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/sou professor/i));

    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John Doe',
        'personal'
      );
    });
  });
});
