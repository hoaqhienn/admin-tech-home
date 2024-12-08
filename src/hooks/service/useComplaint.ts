import { useGetComplaintsQuery } from 'api/serviceApi';

export const useComplaints = () => {
  const { data: complaints = [], isLoading, error } = useGetComplaintsQuery();

  return {
    complaints,
    isLoading,
    error,
  };
};
