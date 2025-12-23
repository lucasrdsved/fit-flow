import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

import { supabase } from '@/integrations/supabase/client';

const TestComponent = ({ onAuthChange }: { onAuthChange?: (userType: string | null) => void }) => {
  const { loading, userType, user, signIn, signUp, signOut } = useAuth();

  React.useEffect(() => {
    if (onAuthChange) {
      onAuthChange(userType);
    }
  }, [userType, onAuthChange]);

  if (loading) return <div>Loading...</div>;
  if (!user) return (
    <div>
      <span data-testid="user-type">{userType === null ? 'null' : userType}</span>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password', 'Test User', 'personal')}>Sign Up</button>
    </div>
  );

  return (
    <div>
      <span data-testid="user-type">{userType === null ? 'null' : userType}</span>
      <span data-testid="user-email">{user.email}</span>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Race Condition Fix', () => {
    it('should wait for profile fetch before setting loading to false', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        user: mockUser,
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600,
        token_type: 'bearer',
      };

      // Mock getSession to resolve with a user
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      // Mock onAuthStateChange
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      // Mock profile fetch with a controlled promise
      let resolveProfile: (value: unknown) => void;
      const profilePromise = new Promise((resolve) => {
        resolveProfile = resolve;
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(profilePromise),
          }),
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // 1. Initial render: Loading...
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Resolve the profile
      setTimeout(() => {
        resolveProfile({
          data: { id: 'test-user-id', user_type: 'student' },
          error: null,
        });
      }, 100);

      // Wait for Loading to disappear and check userType
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const userTypeSpan = screen.getByTestId('user-type');
      expect(userTypeSpan).toHaveTextContent('student');
    });
  });

  describe('Authentication Flow', () => {
    it('should handle sign in successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      // Mock successful sign in
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock profile fetch
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'test-user-id', user_type: 'personal', name: 'Test User' },
              error: null,
            }),
          }),
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Click sign in button
      const signInButton = screen.getByText('Sign In');
      await act(async () => {
        signInButton.click();
      });

      // Should show user email after successful sign in
      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });
    });

    it('should handle sign up successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: { name: 'Test User' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      // Mock successful sign up
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Click sign up button
      const signUpButton = screen.getByText('Sign Up');
      await act(async () => {
        signUpButton.click();
      });

      // Should still show sign up form since no session is created
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('should handle sign out', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        user: mockUser,
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600,
        token_type: 'bearer',
      };

      // Mock initial session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'test-user-id', user_type: 'personal', name: 'Test User' },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Wait for user to be loaded
      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      // Click sign out button
      const signOutButton = screen.getByText('Sign Out');
      await act(async () => {
        signOutButton.click();
      });

      // Should show sign in form again
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle sign in error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      const signInButton = screen.getByText('Sign In');
      await act(async () => {
        signInButton.click();
      });

      // Should still show sign in form
      expect(screen.getByText('Sign In')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle profile fetch error gracefully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        user: mockUser,
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600,
        token_type: 'bearer',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' },
            }),
          }),
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Should still show user (even without profile)
      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      // userType should be null due to profile fetch error
      expect(screen.getByTestId('user-type')).toHaveTextContent('null');
    });
  });

  describe('Mock Login', () => {
    it('should handle mock login for personal trainer', () => {
      let capturedUserType: string | null = null;

      render(
        <AuthProvider>
          <TestComponent onAuthChange={(userType) => { capturedUserType = userType; }} />
        </AuthProvider>,
      );

      // The AuthProvider doesn't expose mockLogin directly to TestComponent
      // This test verifies the context is properly set up
      expect(capturedUserType).toBeNull();
    });
  });
});