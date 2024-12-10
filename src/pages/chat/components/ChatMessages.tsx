import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useGetMessagesByChatIdQuery } from 'api/chatApi';
import { Messages } from 'interface/chat/ChatInterface';
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useGetCurrentUserQuery } from 'api/authApi';
import MessageInput from './MessageInput';

const ChatMessages = React.memo(({ chatId }: { chatId: number | null }) => {
  const { data: user } = useGetCurrentUserQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messages, isLoading } = useGetMessagesByChatIdQuery(
    { chatId: chatId || 0, limit: 50 },
    { skip: !chatId },
  );

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (messages?.length) {
      scrollToBottom();
    }
  }, [messages?.length]);

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
    <Paper className="p-4 h-[calc(100vh-100px)] flex flex-col gap-4 overflow-y-auto">
      {messages?.map((message: Messages) => (
        <MessageBubble
          key={message.messageId}
          message={message}
          currentUserId={user?.user.userId}
        />
      ))}
      <div ref={messagesEndRef} />
      <MessageInput chatId={chatId} />
    </Paper>
  );
});

export default ChatMessages;
