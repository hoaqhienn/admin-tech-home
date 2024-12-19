import { useGetFloorsQuery } from 'api/propertyApi';

export const useFloors = () => {
  const { data: floors = [], isLoading, error, refetch } = useGetFloorsQuery();

  return {
    floors,
    isLoading,
    error,
    refetch,
  };
};
