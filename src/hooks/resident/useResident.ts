import { useGetResidentsQuery } from 'api/residentApi';

export const useResidents = () => {
  const { data: residents = [], isLoading, error, refetch } = useGetResidentsQuery();

  return {
    residents,
    isLoading,
    error,
    refetch,
  };
};
