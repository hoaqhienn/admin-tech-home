// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { api } from 'apis';

interface ProtectedRouteProps {
  children: ReactNode;
}

const getData = async () => {
  const token = localStorage.getItem('_token');
  if (!token) {
    return null;
  }

  const response = await api.get('/admin/current', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setIsAuthenticated(data !== null);
    };
    
    fetchData();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
