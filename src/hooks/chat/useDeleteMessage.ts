// useDeleteMessage.ts
import { useDeleteMessageMutation } from 'api/chatApi';

export const useDeleteMessage = () => {
  const [deleteMessage] = useDeleteMessageMutation();

  const handleDeleteMessage2 = async (id: number) => {
    try {
      await deleteMessage({ id });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return handleDeleteMessage2;
};
