import { useGetProviderQuery } from "api/residentApi";

export const useServiceProviders = () => {
  const { data: providers = [], isLoading, error } = useGetProviderQuery();

  return {
    providers,
    isLoading,
    error,
  };
};
