// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('_token');

  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
