import { useLoginMutation, useGetCurrentUserQuery } from 'api/authApi';
import { LoginCredentials } from 'interface/auth/authInterface';
import { useEffect, useCallback, useState } from 'react';

export const useAuth = () => {
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: user, isLoading: isUserLoading, error: userError } = useGetCurrentUserQuery();

  useEffect(() => {
    const token = localStorage.getItem('_token');
    if (!token) {
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const handleLogin = useCallback(
    async ({ email, password }: LoginCredentials) => {
      try {
        const res = await login({ email, password }).unwrap();
        if (!res?.token) {
          throw new Error('Invalid login response');
        }

        console.log('Login successful:', res);

        // Set tokens
        localStorage.setItem('_email', email);
        localStorage.setItem('_token', res.token);
        localStorage.setItem('_longToken', res.longToken);

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        // Clean up on error
        localStorage.removeItem('_email');
        localStorage.removeItem('_token');
        localStorage.removeItem('_longToken');
        return false;
      }
    },
    [login],
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem('_email');
    localStorage.removeItem('_token');
    localStorage.removeItem('_longToken');
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isLoginLoading || isUserLoading,
    error: userError,
    handleLogin,
    handleLogout,
  };
};
