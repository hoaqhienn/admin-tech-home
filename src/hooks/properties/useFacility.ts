import { useGetFacilitiesQuery } from 'api/propertyApi';

export const useFacilities = () => {
  const { data: facilities = [], isLoading, error } = useGetFacilitiesQuery();

  return {
    facilities,
    isLoading,
    error,
  };
};
