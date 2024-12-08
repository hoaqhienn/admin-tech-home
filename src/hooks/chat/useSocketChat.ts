// import { useEffect, useCallback, useState, useRef } from 'react';
// import io, { Socket } from 'socket.io-client';
// import { Messages } from 'interface/chat/ChatInterface';

// interface SocketState {
//   isConnected: boolean;
//   isConnecting: boolean;
//   error: Error | null;
// }

// interface UseSocketChatProps {
//   chatId?: number;
//   userId?: number;
//   onNewMessage: (message: Messages) => void;
//   socketUrl?: string;
// }

// export const useSocketChat = ({
//   chatId,
//   userId,
//   onNewMessage,
//   socketUrl = 'http://localhost:3000',
// }: UseSocketChatProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [socketState, setSocketState] = useState<SocketState>({
//     isConnected: false,
//     isConnecting: false,
//     error: null,
//   });
//   const socketInitialized = useRef(false);
//   const reconnectAttempts = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   const handleSocketError = useCallback((error: Error) => {
//     console.error('Socket error:', error);
//     setSocketState((prev) => ({
//       ...prev,
//       isConnected: false,
//       isConnecting: false,
//       error: error,
//     }));
//   }, []);

//   // Initialize socket connection
//   useEffect(() => {
//     if (!userId || socketInitialized.current) return;

//     const initializeSocket = () => {
//       socketInitialized.current = true;
//       setSocketState((prev) => ({ ...prev, isConnecting: true }));

//       const newSocket = io(socketUrl, {
//         transports: ['websocket', 'polling'],
//         reconnection: true,
//         reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
//         reconnectionDelay: 1000,
//         timeout: 10000,
//         auth: { userId },
//       });

//       // Socket event handlers
//       newSocket.on('connect', () => {
//         console.log('Socket connected successfully');
//         reconnectAttempts.current = 0;
//         setSocketState({
//           isConnected: true,
//           isConnecting: false,
//           error: null,
//         });
//         newSocket.emit('userOnline', userId);
//       });

//       newSocket.on('connect_error', (error) => {
//         reconnectAttempts.current++;
//         handleSocketError(new Error(`Connection error: ${error.message}`));

//         if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
//           newSocket.disconnect();
//           socketInitialized.current = false;
//         }
//       });

//       newSocket.on('disconnect', (reason) => {
//         console.log('Socket disconnected:', reason);
//         setSocketState((prev) => ({
//           ...prev,
//           isConnected: false,
//           error: new Error(`Disconnected: ${reason}`),
//         }));
//       });

//       newSocket.on('receiveMessage', (message: Messages) => {
//         if (!message?.messageId) {
//           console.error('Received invalid message data:', message);
//           return;
//         }
//         console.log('Received new message:', message);
//         onNewMessage(message);
//       });

//       setSocket(newSocket);
//     };

//     initializeSocket();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//         socketInitialized.current = false;
//       }
//     };
//   }, [userId, socketUrl, handleSocketError, onNewMessage, socket]);

//   // Handle chat room management
//   useEffect(() => {
//     if (!socket?.connected || !chatId) return;

//     const joinChat = () => {
//       socket.emit('joinChat', chatId);
//       console.log('Joined chat:', chatId);
//     };

//     joinChat();

//     return () => {
//       if (socket?.connected) {
//         socket.emit('leaveChat', chatId);
//         console.log('Left chat:', chatId);
//       }
//     };
//   }, [socket, chatId]);

//   const sendMessage = useCallback(
//     async (message: string, files?: File[]): Promise<Messages> => {
//       if (!socket?.connected || !chatId || !userId) {
//         throw new Error('Cannot send message: Socket disconnected or missing chat/user ID');
//       }

//       try {
//         const formData = new FormData();
//         formData.append('message', message.trim());
//         formData.append('chatId', chatId.toString());
//         formData.append('userId', userId.toString());

//         if (files?.length) {
//           files.forEach((file) => {
//             formData.append('files', file);
//           });
//         }

//         const response: any = await api.post<Messages>(`/chat/sendMessages/${chatId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           timeout: 30000,
//         });

//         // Update local state immediately
//         onNewMessage(response);

//         // Notify other users through socket
//         socket.emit('newMessage', {
//           message: response,
//           chatId,
//         });

//         return response;
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
//         handleSocketError(new Error(errorMessage));
//         throw error;
//       }
//     },
//     [socket, chatId, userId, onNewMessage, handleSocketError],
//   );

//   return {
//     sendMessage,
//     socketState,
//     socket,
//     reconnect: useCallback(() => {
//       socketInitialized.current = false;
//       reconnectAttempts.current = 0;
//       if (socket) {
//         socket.disconnect();
//       }
//     }, [socket]),
//   };
// };
