import { useEffect } from 'react';
import { socketService } from 'service/socketService';

export const useSocket = (userId: number | undefined, chatId: number | null) => {
  useEffect(() => {
    if (!userId) return;

    socketService.connect(userId);

    return () => {
      socketService.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!chatId) return;

    socketService.joinChat(chatId);

    return () => {
      socketService.leaveChat(chatId);
    };
  }, [chatId]);
};
