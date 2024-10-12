// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
