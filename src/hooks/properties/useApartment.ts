import { useGetApartmentsQuery } from 'api/propertyApi';

export const useApartments = () => {
  const { data: apartments = [], isLoading, error } = useGetApartmentsQuery();
  

  return {
    apartments,
    isLoading,
    error,
  };
};
