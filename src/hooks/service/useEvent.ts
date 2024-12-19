import { useGetEventsQuery } from 'api/serviceApi';

export const useEvents = () => {
  const { data: events = [], isLoading, error, refetch } = useGetEventsQuery();

  return {
    events,
    isLoading,
    error,
    refetch,
  };
};
