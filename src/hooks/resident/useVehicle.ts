import { useGetVehiclesQuery } from 'api/residentApi';

export const useVehicles = () => {
  const { data: vehicles = [], isLoading, error } = useGetVehiclesQuery();

  return {
    vehicles,
    isLoading,
    error,
  };
};
