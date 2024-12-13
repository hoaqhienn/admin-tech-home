import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useDeleteMessageMutation, useGetMessagesByChatIdQuery } from 'api/chatApi';
import { Messages } from 'interface/chat/ChatInterface';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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

  const {
    data: messages,
    isLoading,
    isFetching,
  } = useGetMessagesByChatIdQuery(
    { chatId: chatId || 0, limit: 50 },
    {
      skip: !chatId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      pollingInterval: 0,
    },
  );

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

  const [deleteMessage] = useDeleteMessageMutation();

  const handleDeleteMessage2 = async (id: number) => {
    try {
      await deleteMessage({ id });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteMessage = useCallback(
    async (messageId: number) => {
      if (!socket || !chatId) return;

      try {
        socket.emit('deleteMessage', chatId, messageId);
        await handleDeleteMessage2(messageId);
        setLocalMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.messageId !== messageId),
        );
        socket.off('deleteMessage');
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    },
    [socket, chatId, handleDeleteMessage2],
  );

  useEffect(() => {
    if (!socket) return;

    socket.on('messageDeleted', ({ messageId }) => {
      console.log('Received message deletion confirmation:', messageId);
    });

    return () => {
      socket.off('messageDeleted');
    };
  }, [socket]);

  useEffect(() => {
    if (messages && isInitialLoad) {
      setLocalMessages(messages);
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (chatId) setIsInitialLoad(true);
  }, [chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    joinChat(chatId);

    const messageHandler = (message: Messages) => handleReceiveMessage(message);
    const deleteHandler = (messageId: number) => handleDeleteMessage(messageId);

    socket.on('receiveMessage', messageHandler);
    socket.on('deleteMessage', deleteHandler);

    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('deleteMessage', deleteHandler);
      if (chatId) {
        leaveChat(chatId);
      }
    };
  }, [socket, chatId, joinChat, leaveChat, handleReceiveMessage]);

  const handleSendMessage = useCallback(
    (message: Messages) => {
      sendMessage(message, chatId!);
      handleReceiveMessage(message);
    },
    [handleReceiveMessage, sendMessage, chatId],
  );

  const scrollToBottom = useMemo(() => {
    return () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [localMessages, scrollToBottom]);

  if (!chatId) {
    return (
      <Box className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Typography variant="h6">Select a chat to start messaging</Typography>
      </Box>
    );
  }

  if (isLoading || isFetching) {
    return (
      <Box className="flex h-full items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-full">
      <Paper className="flex-1 overflow-y-auto">
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
