import { useGetEventsQuery } from 'api/serviceApi';

export const useEvents = () => {
  const { data: events = [], isLoading, error } = useGetEventsQuery();

  return {
    events,
    isLoading,
    error,
  };
};
