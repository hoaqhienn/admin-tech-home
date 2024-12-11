import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGetCurrentUserQuery } from 'api/authApi';
import { Messages } from 'interface/chat/ChatInterface';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useNotification } from 'components/provider/NotificationProvider';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: number) => void;
  leaveChat: (chatId: number) => void;
  sendMessage: (message: Messages, chatId: number) => void;
  deleteMessage: (chatId: number, messageId: number) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinChat: () => {},
  leaveChat: () => {},
  sendMessage: () => {},
  deleteMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: currentUser, isSuccess } = useGetCurrentUserQuery();
  const { showNotification } = useNotification();
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const connect = useCallback((): Socket<DefaultEventsMap, DefaultEventsMap> | null => {
    if (!currentUser?.user.userId) return null;

    const token = localStorage.getItem('_token');
    const socketInstance = io('http://localhost:3000', {
      auth: { token },
      withCredentials: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      socketInstance.emit('userOnline', currentUser.user.userId);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Handle incoming messages and show notifications
    socketInstance.on('receiveMessage', (message: Messages) => {
      console.log('Received message:', message);
      // Only show notification if the message is not from the current user
      // and either we're not in any chat or we're in a different chat
      if (
        message.senderId !== currentUser.user.userId &&
        (!activeChat || message.chatId !== activeChat)
      ) {
        showNotification({
          title: 'Bạn có tin nhắn mới',
          body: message.content || 'New message received',
          icon: '/path-to-your-icon.png', // Add your notification icon path
          onClick: () => {
            // Navigate to chat (you'll need to implement this)
            window.location.href = `/chat`;
          },
        });
      }
    });

    return socketInstance;
  }, [currentUser?.user.userId, showNotification]);

  useEffect(() => {
    let socketInstance: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

    if (isSuccess && currentUser?.user.userId) {
      socketInstance = connect();
      if (socketInstance) {
        setSocket(socketInstance);
      }
    }

    return () => {
      if (socketInstance) {
        socketInstance.emit('userOffline', currentUser?.user.userId);
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [isSuccess, currentUser?.user.userId, connect]);

  const joinChat = useCallback(
    (chatId: number) => {
      if (socket && isConnected) {
        console.log('Joining chat:', chatId);
        setActiveChat(chatId);
        socket.emit('joinChat', chatId);
      }
    },
    [socket, isConnected],
  );

  const leaveChat = useCallback(
    (chatId: number) => {
      if (socket && isConnected) {
        console.log('Leaving chat:', chatId);
        setActiveChat(null);
        socket.emit('outChat', chatId);
      }
    },
    [socket, isConnected],
  );

  const sendMessage = useCallback(
    (message: Messages, chatId: number) => {
      if (socket && isConnected) {
        console.log('Sending message to chat:', chatId, message);
        socket.emit('sendMessage', message, chatId);
      }
    },
    [socket, isConnected],
  );

  const deleteMessage = useCallback(
    (chatId: number, messageId: number) => {
      if (socket && isConnected) {
        console.log('Deleting message:', messageId, 'from chat:', chatId);
        socket.emit('deleteMessage', chatId, messageId);
      }
    },
    [socket, isConnected],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinChat,
        leaveChat,
        sendMessage,
        deleteMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
