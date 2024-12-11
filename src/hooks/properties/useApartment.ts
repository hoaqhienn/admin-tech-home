import { useGetApartmentByIdQuery, useGetApartmentsQuery } from 'api/propertyApi';

export const useApartments = () => {
  const { data: apartments = [], isLoading, error } = useGetApartmentsQuery();
  // get apartment by id query

  const getApartmentById = (id: number) => {
    const data = useGetApartmentByIdQuery(id);
    return data;
  };

  return {
    apartments,
    getApartmentById,
    isLoading,
    error,
  };
};
