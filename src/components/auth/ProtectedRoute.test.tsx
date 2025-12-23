import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderProtectedRoute = (
  authMock: unknown,
  allowedTypes?: ('personal' | 'student')[]
) => {
  vi.mocked(useAuth).mockReturnValue(authMock);

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/auth/login" element={<div>Login Page</div>} />
        <Route path="/trainer" element={<div>Trainer Dashboard</div>} />
        <Route path="/student" element={<div>Student Dashboard</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedTypes={allowedTypes}>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('shows loading spinner when loading', () => {
    renderProtectedRoute({ loading: true });
    // Look for the spinner SVG or container
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderProtectedRoute({ loading: false, user: null });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to student dashboard if personal tries to access student route', () => {
    renderProtectedRoute(
      { loading: false, user: { id: '1' }, userType: 'personal' },
      ['student']
    );
    expect(screen.getByText('Trainer Dashboard')).toBeInTheDocument();
  });

  it('redirects to trainer dashboard if student tries to access personal route', () => {
    renderProtectedRoute(
      { loading: false, user: { id: '1' }, userType: 'student' },
      ['personal']
    );
    expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
  });

  it('renders content when access is granted', () => {
    renderProtectedRoute(
      { loading: false, user: { id: '1' }, userType: 'personal' },
      ['personal']
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
