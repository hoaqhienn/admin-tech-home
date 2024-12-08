import { useGetCurrentUserQuery, useLoginMutation } from 'api/authApi';

export const useAuth = () => {
  const [login] = useLoginMutation();
  const { data: user, ...userQuery } = useGetCurrentUserQuery();

  const handleLogin = async (email: string, password: string) => {
    localStorage.setItem('_email', email);
    const { data }: any = await login({ email, password });
    localStorage.setItem('_token', JSON.stringify(data.token));
    localStorage.setItem('_refreshToken', JSON.stringify(data.refreshToken));
  };

  return {
    user,
    userQuery,
    handleLogin,
  };
};
