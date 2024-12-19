import { useGetProviderQuery } from "api/residentApi";

export const useServiceProviders = () => {
  const { data: providers = [], isLoading, error, refetch } = useGetProviderQuery();

  return {
    providers,
    isLoading,
    error,
    refetch
  };
};
