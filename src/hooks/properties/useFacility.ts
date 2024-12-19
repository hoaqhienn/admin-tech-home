import { useGetFacilitiesQuery } from 'api/propertyApi';

export const useFacilities = () => {
  const { data: facilities = [], isLoading, error, refetch } = useGetFacilitiesQuery();

  return {
    facilities,
    isLoading,
    error,
    refetch,
  };
};
