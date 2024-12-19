import { useGetComplaintsQuery } from 'api/serviceApi';

export const useComplaints = () => {
  const { data: complaints = [], isLoading, error, refetch } = useGetComplaintsQuery();

  return {
    complaints,
    isLoading,
    error,
    refetch,
  };
};
