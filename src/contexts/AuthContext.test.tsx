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
        onAuthStateChange: vi.fn(),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

import { supabase } from '@/integrations/supabase/client';

const TestComponent = () => {
  const { loading, userType, user } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No User</div>;
  return (
    <div>
      <span data-testid="user-type">{userType === null ? 'null' : userType}</span>
    </div>
  );
};

describe('AuthContext Race Condition', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

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

    // 2. Wait for getSession to resolve (it's a microtask, usually fast)
    // We can just wait a tick or check that loading is STILL there.
    // In the BUGGY version, loading becomes false almost immediately after render/useEffect.

    // We try to verify that it stays loading while profile is pending.
    // We can't easily "wait for time" without fake timers, but let's check immediate state.
    // If we simply wait for the queue to flush, the buggy code will have set loading=false.

    // Let's use `waitFor` to assert that we are STILL loading.
    // BUT `waitFor` waits for a condition to be TRUE.
    // If we assume the bug makes it FALSE, we can verify that.

    // HOWEVER, to make the test FAIL when the bug is present:
    // We want to ensure that "Loading..." is PRESENCE is maintained.
    // This is hard to assert "forever" (or for X ms).

    // Better strategy: Assert that when "Loading..." DISAPPEARS, userType is 'student'.

    // Resolve the profile AFTER some time or manually.
    // But if the bug is present, "Loading..." disappears BEFORE we resolve.

    // So:
    // 1. Render.
    // 2. Wait for getSession to settle (which we can't explicitly do easily without access to the promise).
    //    But we know it runs in useEffect.

    // Let's just resolve the profile in a setImmediate/setTimeout to ensure the chain has a chance to run.
    setTimeout(() => {
      resolveProfile({
        data: { id: 'test-user-id', user_type: 'student' },
        error: null,
      });
    }, 100);

    // 3. Wait for Loading to disappear.
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // 4. Assert userType.
    // If bug is present: Loading disappeared BEFORE timeout. userType is null. Test FAILS.
    // If fix is present: Loading waits for timeout/resolve. userType is student. Test PASSES.

    const userTypeSpan = screen.getByTestId('user-type');
    expect(userTypeSpan).toHaveTextContent('student');
  });
});
