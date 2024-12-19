import { useGetVehiclesQuery } from 'api/residentApi';

export const useVehicles = () => {
  const { data: vehicles = [], isLoading, error, refetch } = useGetVehiclesQuery();

  return {
    vehicles,
    isLoading,
    error,
    refetch,
  };
};
