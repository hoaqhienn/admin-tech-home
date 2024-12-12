import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useDeleteMessageMutation, useGetMessagesByChatIdQuery } from 'api/chatApi';
import { Messages } from 'interface/chat/ChatInterface';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { useGetCurrentUserQuery } from 'api/authApi';
import MessageInput from './MessageInput';
import { useSocket } from 'components/provider/SocketProvider';

const ChatMessages = React.memo(({ chatId }: { chatId: number | null }) => {
  const { data: user } = useGetCurrentUserQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Messages[]>([]);
  const { socket, joinChat, leaveChat, sendMessage } = useSocket();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: messages, isLoading } = useGetMessagesByChatIdQuery(
    { chatId: chatId || 0, limit: 50 },
    {
      skip: !chatId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  // Handle new message receipt with deduplication
  const handleReceiveMessage = useCallback((newMessage: Messages) => {
    setLocalMessages((prevMessages) => {
      // More robust message deduplication
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

      // Sort messages chronologically
      const updatedMessages = [...prevMessages, newMessage].sort(
        (a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
      );

      return updatedMessages;
    });
  }, []);

  const [deleteMessage] = useDeleteMessageMutation();

  const handleDeleteMessage = async (id: number) => {
    try {
      await deleteMessage({ id });
    } catch (error) {
      // Handle error
      console.error('Error deleting message:', error);
    }
  };

  // Update local messages when API messages change
  useEffect(() => {
    if (messages && isInitialLoad) {
      setLocalMessages(messages);
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  // Reset trạng thái tải lại khi `chatId` thay đổi
  useEffect(() => {
    setIsInitialLoad(true);
  }, [chatId]);

  // Socket setup with better cleanup
  useEffect(() => {
    if (!socket || !chatId) return;

    // Join chat room
    joinChat(chatId);

    // Set up event listeners
    const messageHandler = (message: Messages) => {
      console.log('Received message:', message);
      handleReceiveMessage(message);
    };

    const deleteHandler = (messageId: number) => {
      console.log('Message deleted:', messageId);
      handleDeleteMessage(messageId);
    };

    socket.on('receiveMessage', messageHandler);
    socket.on('deleteMessage', deleteHandler);

    // Cleanup function
    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('deleteMessage', deleteHandler);
      if (chatId) {
        leaveChat(chatId);
      }
    };
  }, [socket, chatId, joinChat, leaveChat, handleReceiveMessage, handleDeleteMessage]);

  // Message sending handler with optimistic update
  const handleSendMessage = useCallback(
    (message: Messages) => {
      // emit message
      sendMessage(message, chatId!);

      handleReceiveMessage(message);
    },
    [handleReceiveMessage, sendMessage, chatId],
  );

  // Auto-scroll with debounce
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [localMessages]);

  if (!chatId) {
    return (
      <Box className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Typography variant="h6">Select a chat to start messaging</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box className="flex h-full items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-[calc(100vh-100px)]">
      <Paper className="flex-1 p-4 overflow-y-auto">
        <Box className="flex flex-col gap-4">
          {localMessages?.map((message: Messages) => (
            <MessageBubble
              key={message.messageId}
              message={message}
              currentUserId={user?.user.userId}
              onDeleteMessage={handleDeleteMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>
      </Paper>
      <MessageInput chatId={chatId} onMessageSent={handleSendMessage} />
    </Box>
  );
});

export default ChatMessages;
