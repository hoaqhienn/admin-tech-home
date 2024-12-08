import { useGetServiceQuery } from 'api/serviceApi';

export const useServices = () => {
  const { data: services = [], isLoading, error } = useGetServiceQuery();

  return {
    services,
    isLoading,
    error,
  };
};
