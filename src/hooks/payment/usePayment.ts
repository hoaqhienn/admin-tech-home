import { useGetPaymentsQuery } from 'api/serviceApi';

export const usePayments = () => {
  const { data: payments = [], isLoading, error, refetch } = useGetPaymentsQuery();

  return {
    payments,
    isLoading,
    error,
    refetch,
  };
};
