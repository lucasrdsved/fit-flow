import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ('personal' | 'student')[];
}

/**
 * A wrapper component that protects routes based on authentication status and user roles.
 *
 * If the user is not authenticated, they are redirected to the login page.
 * If the user is authenticated but does not have the required role, they are redirected to their appropriate dashboard.
 * If authentication is still loading, a loading spinner is displayed.
 *
 * @param {ProtectedRouteProps} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if access is granted.
 * @param {('personal' | 'student')[]} [props.allowedTypes] - An array of allowed user types.
 * @returns {JSX.Element} The protected content or a redirect.
 */
export function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { user, userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedTypes && userType && !allowedTypes.includes(userType)) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = userType === 'personal' ? '/trainer' : '/student';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
