import { useGetPaymentsQuery } from 'api/serviceApi';

export const usePayments = () => {
  const { data: payments = [], isLoading, error } = useGetPaymentsQuery();

  return {
    payments,
    isLoading,
    error,
  };
};
