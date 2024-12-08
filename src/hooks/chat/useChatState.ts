// import { useCallback, useRef, useState } from 'react';
// import { GalleryState, GroupChat, Messages } from 'interface/chat/ChatInterface';
// import { useSocketChat } from './useSocketChat';
// import { useAuth } from 'hooks/auth/useAuth';
// import {
//   useGetAllChatsQuery,
//   useGetMessagesByChatIdQuery,
//   useSendMessageMutation,
// } from 'api/chatApi';

// export const useChatState = () => {
//   const { user } = useAuth();
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [selectedGroupChat, setSelectedGroupChat] = useState<GroupChat | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [newMessage, setNewMessage] = useState<string>('');
//   const [files, setFiles] = useState<File[]>([]);
//   const [galleryState, setGalleryState] = useState<GalleryState>({
//     isOpen: false,
//     images: [],
//     currentIndex: 0,
//   });

//   // RTK Query hooks
//   const {
//     data: groupChats = [],
//     isLoading,
//     error,
//   } = useGetAllChatsQuery(undefined, {
//     skip: !user,
//   });

//   const { data: messages = [] } = useGetMessagesByChatIdQuery(
//     { chatId: selectedGroupChat?.chatId ?? 0 },
//     {
//       skip: !selectedGroupChat || !user,
//     },
//   );

//   const [sendMessageMutation] = useSendMessageMutation();

//   // Message cache for socket handling
//   const messageCache = useRef(new Set<string>());

//   const handleNewMessage = useCallback((message: Messages) => {
//     if (messageCache.current.has(message.messageId.toString())) return;
//     messageCache.current.add(message.messageId.toString());
//   }, []);

//   // Socket integration
//   const { sendMessage: socketSendMessage, socketState } = useSocketChat({
//     chatId: selectedGroupChat?.chatId,
//     userId: user?.user.id,
//     onNewMessage: handleNewMessage,
//   });

//   // Combined send message function
//   const sendMessage = async (message: string, files?: File[]) => {
//     if (!selectedGroupChat?.chatId) return;

//     try {
//       // Send via RTK Query
//       await sendMessageMutation({
//         chatId: selectedGroupChat.chatId,
//         message,
//         files,
//       }).unwrap();

//       // Notify via socket
//       await socketSendMessage(message, files);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       throw error;
//     }
//   };

//   const handleFileSelect = useCallback((selectedFiles: File[]) => {
//     setFiles((prev) => [...prev, ...selectedFiles]);
//   }, []);

//   const handleFileRemove = useCallback((fileToRemove: File) => {
//     setFiles((prev) => prev.filter((file) => file !== fileToRemove));
//   }, []);

//   return {
//     isOpen,
//     setIsOpen,
//     selectedGroupChat,
//     setSelectedGroupChat,
//     searchQuery,
//     setSearchQuery,
//     groupChats,
//     messages,
//     newMessage,
//     setNewMessage,
//     files,
//     setFiles,
//     galleryState,
//     setGalleryState,
//     sendMessage,
//     socketState,
//     user,
//     isLoading,
//     error,
//     handleFileSelect,
//     handleFileRemove,
//   };
// };

// export const useChatHandlers = (state: ReturnType<typeof useChatState>) => {
//   const {
//     setGalleryState,
//     setNewMessage,
//     selectedGroupChat,
//     newMessage,
//     setIsOpen,
//     setSelectedGroupChat,
//     sendMessage,
//     files,
//     setFiles,
//     user,
//   } = state;

//   const handleMessageChange = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//       setNewMessage(event.target.value);
//     },
//     [setNewMessage],
//   );

//   const handleImageClick = useCallback(
//     (files: string[], index: number): void => {
//       setGalleryState({
//         isOpen: true,
//         images: files,
//         currentIndex: index,
//       });
//     },
//     [setGalleryState],
//   );

//   const handleGalleryClose = useCallback((): void => {
//     setGalleryState((prev) => ({ ...prev, isOpen: false }));
//   }, [setGalleryState]);

//   const handleSendMessage = useCallback(async (): Promise<void> => {
//     if (!user) {
//       console.error('User not authenticated');
//       return;
//     }

//     if ((!newMessage.trim() && !files.length) || !selectedGroupChat) return;

//     try {
//       await sendMessage(newMessage, files);
//       setNewMessage('');
//       setFiles([]);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   }, [newMessage, selectedGroupChat, files, sendMessage, setNewMessage, setFiles, user]);

//   const handleKeyPress = useCallback(
//     (event: React.KeyboardEvent<HTMLDivElement>): void => {
//       if (event.key === 'Enter' && !event.shiftKey) {
//         event.preventDefault();
//         handleSendMessage();
//       }
//     },
//     [handleSendMessage],
//   );

//   const handleChatOpen = useCallback(() => {
//     if (!user) {
//       console.error('Please login to use chat');
//       return;
//     }
//     setIsOpen(true);
//   }, [setIsOpen, user]);

//   const handleChatClose = useCallback(() => {
//     setIsOpen(false);
//     setSelectedGroupChat(null);
//   }, [setIsOpen, setSelectedGroupChat]);

//   const handleChatSelect = useCallback(
//     (chat: GroupChat): void => {
//       setSelectedGroupChat(chat);
//     },
//     [setSelectedGroupChat],
//   );

//   return {
//     handleImageClick,
//     handleGalleryClose,
//     handleSendMessage,
//     handleKeyPress,
//     handleChatOpen,
//     handleChatClose,
//     handleChatSelect,
//     handleMessageChange,
//   };
// };
