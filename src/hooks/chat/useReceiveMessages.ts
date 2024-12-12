// useReceiveMessages.ts
import { useState, useCallback } from 'react';
import { Messages } from 'interface/chat/ChatInterface';

export const useReceiveMessages = () => {
  const [localMessages, setLocalMessages] = useState<Messages[]>([]);

  const handleReceiveMessage = useCallback((newMessage: Messages) => {
    setLocalMessages((prevMessages) => {
      const messageExists = prevMessages.some(
        (msg) =>
          msg.messageId === newMessage.messageId ||
          (msg.senderId === newMessage.senderId &&
            msg.content === newMessage.content &&
            Math.abs(
              new Date(msg.createdAt!).getTime() - new Date(newMessage.createdAt!).getTime(),
            ) < 1000),
      );

      if (messageExists) return prevMessages;

      return [...prevMessages, newMessage].sort(
        (a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
      );
    });
  }, []);

  return { localMessages, handleReceiveMessage };
};
