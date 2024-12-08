import { useGetBillsQuery } from 'api/serviceApi';

export const useBills = () => {
  const { data: bills = [], isLoading, error } = useGetBillsQuery();

  return {
    bills,
    isLoading,
    error,
  };
};
