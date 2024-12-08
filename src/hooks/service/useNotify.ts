import { useGetNotificationsQuery } from 'api/serviceApi';

export const useNotifications = () => {
  const { data: notifications = [], isLoading, error } = useGetNotificationsQuery();

  return {
    notifications,
    isLoading,
    error,
  };
};
