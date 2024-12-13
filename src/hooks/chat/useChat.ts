import { useGetAllChatsQuery, useGetChatDetailsQuery } from 'api/chatApi';
import { ChatDetail } from 'interface/chat/ChatInterface';

export const useChats = () => {
  const { data: chats = [], isLoading: chatsLoading, error: chatsError } = useGetAllChatsQuery();

  const useChatDetail = (chatId: number) => {
    const {
      data: chatDetail = {} as ChatDetail, // Change default from [] to empty ChatDetail
      isLoading: detailLoading,
      error: detailError,
    } = useGetChatDetailsQuery({ chatId });
    return {
      chatDetail,
      isLoading: detailLoading,
      error: detailError,
    };
  };

  return {
    chats,
    isLoading: chatsLoading,
    error: chatsError,
    useChatDetail,
  };
};
