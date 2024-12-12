import { useLoginMutation, useGetCurrentUserQuery } from 'api/authApi';
import { LoginCredentials } from 'interface/auth/authInterface';
import { useEffect, useCallback, useState } from 'react';

export const useAuth = () => {
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Chỉ fetch user data khi có token
  const hasToken = !!localStorage.getItem('_token');

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken,
  });

  // Đánh dấu đã khởi tạo ngay khi kiểm tra xong token
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleLogin = useCallback(
    async ({ email, password }: LoginCredentials) => {
      try {
        const res = await login({ email, password }).unwrap();
        if (!res?.token) {
          throw new Error('Invalid login response');
        }

        // Set tokens
        localStorage.setItem('_email', email);
        localStorage.setItem('_token', res.token);
        localStorage.setItem('_longToken', res.longToken);

        // RTK Query sẽ tự động fetch user data khi token thay đổi
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        // Cleanup nếu có lỗi
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

  // Xử lý loading state tốt hơn
  const isLoading = !isInitialized || isLoginLoading || (hasToken && isUserLoading);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error: userError,
    handleLogin,
    handleLogout,
  };
};
