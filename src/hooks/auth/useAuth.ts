import { useGetCurrentUserQuery, useLoginMutation } from 'api/authApi';
import { LoginCredentials } from 'interface/auth/authInterface';

export const useAuth = () => {
  const [login] = useLoginMutation();
  const { data: user, ...userQuery } = useGetCurrentUserQuery();

  const handleLogin = async ({ email, password }: LoginCredentials) => {
    try {
      const res = await login({ email, password }).unwrap();
      if (!res) throw new Error('Login failed');

      console.log('Login success:', res);

      localStorage.setItem('_email', email);
      localStorage.setItem('_token', res.token);
      localStorage.setItem('_longToken', res.longToken);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('_email');
    localStorage.removeItem('_token');
    localStorage.removeItem('_longToken');
  };

  return {
    user,
    userQuery,
    handleLogin,
    handleLogout,
  };
};
