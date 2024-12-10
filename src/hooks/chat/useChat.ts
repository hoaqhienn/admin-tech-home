import { useGetAllChatsQuery, useGetMessagesByChatIdQuery } from 'api/chatApi';
import { GroupChat } from 'interface/chat/ChatInterface';
import { useState } from 'react';

export const useChats = () => {
  const { data: chats, isLoading: isChatsLoading, error: chatsError } = useGetAllChatsQuery();

  const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);

  const {
    data: messages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetMessagesByChatIdQuery({ chatId: selectedChat?.chatId || 0 });

  return {
    chats,
    messages,
    isLoading: isChatsLoading || isMessagesLoading,
    error: chatsError || messagesError,
    selectedChat,
    setSelectedChat,
  };
};
