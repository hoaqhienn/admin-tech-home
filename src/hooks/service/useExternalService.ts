import { useGetOutsourcingServicesQuery } from "api";

export const useExternalServices = () => {
  const { data: eServices = [], isLoading, error, refetch } = useGetOutsourcingServicesQuery();

  return {
    eServices,
    isLoading,
    error,
    refetch,
  };
};
