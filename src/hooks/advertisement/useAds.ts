import { useGetAdvertisementsQuery } from "api";

export const useAds = () => {
  const { data: ads = [], isLoading, error } = useGetAdvertisementsQuery();

  return {
    ads,
    isLoading,
    error,
  };
};
