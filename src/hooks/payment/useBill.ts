import { useGetBillsQuery } from 'api/serviceApi';

export const useBills = () => {
  const { data: bills = [], isLoading, error, refetch } = useGetBillsQuery();

  return {
    bills,
    isLoading,
    error,
    refetch,
  };
};
