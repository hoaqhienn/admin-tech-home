import { useGetAdvertisementsQuery } from "api";

export const useAds = () => {
  const { data: ads = [], isLoading, error, refetch } = useGetAdvertisementsQuery();

  return {
    ads,
    isLoading,
    error,
    refetch,
  };
};
