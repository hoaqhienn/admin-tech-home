import { useGetOutsourcingServicesQuery } from "api";

export const useExternalServices = () => {
  const { data: eServices = [], isLoading, error } = useGetOutsourcingServicesQuery();

  return {
    eServices,
    isLoading,
    error,
  };
};
