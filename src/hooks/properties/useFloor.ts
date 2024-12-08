import { useGetFloorsQuery } from 'api/propertyApi';

export const useFloors = () => {
  const { data: floors = [], isLoading, error } = useGetFloorsQuery();

  return {
    floors,
    isLoading,
    error,
  };
};
