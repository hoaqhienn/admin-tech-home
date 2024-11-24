import { useEffect, useCallback, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Messages } from 'interface/Chat';
import { api } from 'apis';

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

export const useSocketChat = (chatId: number | null, onNewMessage: (message: Messages) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketState, setSocketState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Use ref to track if socket is already initialized
  const socketInitialized = useRef(false);

  // Initialize socket connection with retry logic
  useEffect(() => {
    // Only initialize if not already done
    if (!socketInitialized.current) {
      socketInitialized.current = true;

      const initSocket = () => {
        console.log('Initializing socket connection...');
        setSocketState((prev) => ({ ...prev, isConnecting: true, error: null }));

        const newSocket = io('http://localhost:3000', {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setSocketState({
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        });

        newSocket.on('connect_error', (error) => {
          console.warn('Socket connection error:', error);
          setSocketState({
            isConnected: false,
            isConnecting: false,
            error: error,
          });
        });

        newSocket.on('disconnect', (reason) => {
          console.warn('Socket disconnected:', reason);
          setSocketState((prev) => ({
            ...prev,
            isConnected: false,
            error: new Error(`Disconnected: ${reason}`),
          }));
        });

        setSocket(newSocket);

        // Cleanup function
        return () => {
          console.log('Cleaning up socket connection...');
          newSocket.disconnect();
          socketInitialized.current = false;
        };
      };

      return initSocket();
    }
  }, []); // Empty dependency array since we're using ref

  // Handle chat room join/leave and message listening
  useEffect(() => {
    if (!socket || !chatId) return;

    console.log(`Joining chat room: ${chatId}`);

    const handleNewMessage = (newMessage: Messages) => {
      try {
        console.log('New message received:', newMessage);
        onNewMessage(newMessage);
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    };

    // Join chat room with acknowledgment
    socket.emit('join-chat', chatId, (error: Error | null) => {
      if (error) {
        console.error('Error joining chat room:', error);
        setSocketState((prev) => ({ ...prev, error }));
      } else {
        console.log(`Successfully joined chat room: ${chatId}`);
      }
    });

    // Listen for new messages with error handling
    socket.on(`new-message-${chatId}`, handleNewMessage);

    // Cleanup function for chat room
    return () => {
      if (socket && socket.connected) {
        console.log(`Leaving chat room: ${chatId}`);
        socket.off(`new-message-${chatId}`);
        socket.emit('leave-chat', chatId, (error: Error | null) => {
          if (error) {
            console.error('Error leaving chat room:', error);
          } else {
            console.log(`Successfully left chat room: ${chatId}`);
          }
        });
      }
    };
  }, [chatId, onNewMessage, socket]);

  const sendMessage = useCallback(
    async (message: string, files?: File[]) => {
      if (!socket || !chatId) {
        throw new Error('Socket not connected or chat not selected');
      }

      if (!socketState.isConnected) {
        throw new Error('Socket connection lost. Please try again.');
      }

      try {
        const formData = new FormData();
        formData.append('message', message);

        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append('files', file);
          });
        }

        console.log('Sending message:', { message, files });
        const { data: newMessage } = await api.post(`/chat/sendMessages/${chatId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return new Promise<Messages>((resolve, reject) => {
          socket.emit('send-message', { chatId, message: newMessage }, (error: Error | null) => {
            if (error) {
              console.error('Error sending message via socket:', error);
              reject(error);
            } else {
              console.log('Message sent successfully');
              resolve(newMessage);
            }
          });

          // Add timeout for acknowledgment
          setTimeout(() => {
            reject(new Error('Message send timeout'));
          }, 5000);
        });
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    [chatId, socket, socketState.isConnected],
  );

  const reconnect = useCallback(() => {
    if (socket) {
      console.log('Attempting to reconnect socket...');
      socket.connect();
    }
  }, [socket]);

  return {
    sendMessage,
    socketState,
    reconnect,
  };
};
