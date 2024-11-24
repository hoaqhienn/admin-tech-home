import { api } from 'apis';
import { GalleryState, GroupChat, Messages } from 'interface/Chat';
import { useCallback, useEffect, useState } from 'react';
import { useSocketChat } from './useSocketChat';

export const useChatState = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedGroupChat, setSelectedGroupChat] = useState<GroupChat | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [galleryState, setGalleryState] = useState<GalleryState>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const handleNewMessage = useCallback((message: Messages) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const { sendMessage } = useSocketChat(selectedGroupChat?.chatId ?? null, handleNewMessage);

  return {
    isOpen,
    setIsOpen,
    selectedGroupChat,
    setSelectedGroupChat,
    searchQuery,
    setSearchQuery,
    groupChats,
    setGroupChats,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    files,
    setFiles,
    galleryState,
    setGalleryState,
    sendMessage,
  };
};

export const useChatHandlers = (state: ReturnType<typeof useChatState>) => {
  const {
    setGalleryState,
    setNewMessage,
    selectedGroupChat,
    newMessage,
    setIsOpen,
    setSelectedGroupChat,
    sendMessage,
    files,
    setFiles,
  } = state;

  const handleImageClick = useCallback(
    (files: string[], index: number): void => {
      setGalleryState({
        isOpen: true,
        images: files,
        currentIndex: index,
      });
    },
    [setGalleryState],
  );

  const handleGalleryClose = useCallback((): void => {
    setGalleryState((prev) => ({ ...prev, isOpen: false }));
  }, [setGalleryState]);

  const handleSendMessage = useCallback(async (): Promise<void> => {
    if (newMessage.trim() && selectedGroupChat) {
      console.log('Sending message:', newMessage, files);
      
      await sendMessage(newMessage, files);
      setNewMessage('');
      setFiles([]);
    }
  }, [newMessage, selectedGroupChat, files, sendMessage, setNewMessage, setFiles]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFiles(Array.from(event.target.files));
      }
    },
    [setFiles],
  );

  const handleChatOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleChatClose = useCallback(() => {
    setIsOpen(false);
    setSelectedGroupChat(null);
  }, [setIsOpen, setSelectedGroupChat]);

  const handleChatSelect = useCallback(
    (chat: GroupChat): void => {
      setSelectedGroupChat(chat);
    },
    [setSelectedGroupChat],
  );

  return {
    handleImageClick,
    handleGalleryClose,
    handleSendMessage,
    handleKeyPress,
    handleChatOpen,
    handleChatClose,
    handleChatSelect,
    handleFileSelect,
  };
};

export const useChatData = (state: ReturnType<typeof useChatState>) => {
  const { setGroupChats, setMessages, selectedGroupChat } = state;

  const fetchGroupChats = useCallback(async (): Promise<void> => {
    try {
      const response: GroupChat[] = await api.get('/chat/getAllChats');
      setGroupChats(response);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [setGroupChats]);

  const fetchChats = useCallback(async (): Promise<void> => {
    if (!selectedGroupChat) return;
    try {
      const response: { messages: Messages[] } = await api.get(
        `/chat/getAllMessagesByChatId/${selectedGroupChat.chatId}?offset=0&limit=100`,
      );
      setMessages(response.messages);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [selectedGroupChat, setMessages]);

  useEffect(() => {
    fetchGroupChats();
    fetchChats();
  }, [selectedGroupChat, fetchGroupChats, fetchChats]);

  return { fetchGroupChats, fetchChats };
};
