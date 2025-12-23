import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLogout } from './useAuthActions';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('useLogout', () => {
  it('calls signOut, shows toast and navigates to home', async () => {
    const signOutMock = vi.fn().mockResolvedValue({ error: null });
    const navigateMock = vi.fn();
    const toastMock = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      signOut: signOutMock,
      user: null,
      session: null,
      profile: null,
      userType: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      mockLogin: vi.fn(),
    });
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    vi.mocked(useToast).mockReturnValue({ toast: toastMock, toasts: [] });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(signOutMock).toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: expect.stringContaining('Sessão encerrada'),
    }));
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });
});
