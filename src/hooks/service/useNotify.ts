import { useGetNotificationsQuery } from 'api/serviceApi';

export const useNotifications = () => {
  const { data: notifications = [], isLoading, error, refetch } = useGetNotificationsQuery();

  return {
    notifications,
    isLoading,
    error,
    refetch,
  };
};
