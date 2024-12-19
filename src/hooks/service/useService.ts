import { useGetServiceQuery } from 'api/serviceApi';

export const useServices = () => {
  const { data: services = [], isLoading, error, refetch } = useGetServiceQuery();

  return {
    services,
    isLoading,
    error,
    refetch,
  };
};
