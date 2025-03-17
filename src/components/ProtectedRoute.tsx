
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: 'passenger' | 'driver' | null;
};

const ProtectedRoute = ({ children, requiredRole = null }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  
  // If still loading auth state, show a nicer loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wassalni-green mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/passenger-signin" />;
  }
  
  // If a specific role is required, check if user has that role
  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect passengers to passenger-specific routes and vice versa
    if (profile?.role === 'passenger') {
      return <Navigate to="/rides" />;
    } else {
      return <Navigate to="/offer-ride" />;
    }
  }
  
  // User is authenticated and has the required role (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
