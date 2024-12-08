import { useGetResidentsQuery } from 'api/residentApi';

export const useResidents = () => {
  const { data: residents = [], isLoading, error } = useGetResidentsQuery();

  return {
    residents,
    isLoading,
    error,
  };
};
