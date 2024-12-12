import { Avatar, Box, Typography, CircularProgress } from '@mui/material';
import { Messages } from 'interface/chat/ChatInterface';
import React, { useState, useRef } from 'react';
import FileAttachment from './FileAttachment';

const MessageBubble = React.memo(
  ({
    message,
    currentUserId,
    onDeleteMessage,
  }: {
    message: Messages & {
      Files?: Array<{
        fileId: number;
        fileName: string;
        fileUrl: string;
        fileType: string;
      }>;
    };
    currentUserId: number | undefined;
    onDeleteMessage: (messageId: number) => Promise<void>;
  }) => {
    const isOwnMessage = message.senderId === currentUserId;
    const [deleteProgress, setDeleteProgress] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteTimeoutRef = useRef<NodeJS.Timeout>();
    const deleteDuration = 1000; // 1 second hold to delete
    const progressInterval = 50; // Update progress every 50ms

    const handleMouseDown = () => {
      if (!isOwnMessage) return;

      setIsDeleting(true);
      let progress = 0;

      // Start progress animation
      const intervalId = setInterval(() => {
        progress += (progressInterval / deleteDuration) * 100;
        if (progress >= 100) {
          clearInterval(intervalId);
        }
        setDeleteProgress(Math.min(progress, 100));
      }, progressInterval);

      // Set timeout for delete action
      deleteTimeoutRef.current = setTimeout(async () => {
        clearInterval(intervalId);
        setDeleteProgress(100);
        try {
          await onDeleteMessage(message.messageId!);
        } catch (error) {
          console.error('Failed to delete message:', error);
        }
        setIsDeleting(false);
        setDeleteProgress(0);
      }, deleteDuration);
    };

    const handleMouseUpOrLeave = () => {
      if (!isOwnMessage) return;

      clearTimeout(deleteTimeoutRef.current);
      setIsDeleting(false);
      setDeleteProgress(0);
    };

    return (
      <Box
        className={`flex gap-2 items-start max-w-[70%] ${isOwnMessage ? 'self-end' : 'self-start'}`}
      >
        {!isOwnMessage && (
          <Avatar className="w-8 h-8">{message.senderId?.toString().charAt(0)}</Avatar>
        )}
        <Box
          className={`p-3 rounded-lg relative ${isOwnMessage ? 'bg-blue-50' : 'bg-gray-100'}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{ touchAction: 'none' }}
        >
          {isDeleting && isOwnMessage && (
            <Box className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <CircularProgress
                variant="determinate"
                value={deleteProgress}
                size={24}
                className="text-red-500"
              />
            </Box>
          )}
          <Box>
            {!isOwnMessage && (
              <Typography variant="caption" className="font-bold">
                {message.senderId}
              </Typography>
            )}
            {message.content && <Typography variant="body1">{message.content}</Typography>}

            {message.Files && message.Files.length > 0 && (
              <Box className="mt-2 space-y-2">
                {message.Files.map((file) => (
                  <FileAttachment key={file.fileId} file={file} />
                ))}
              </Box>
            )}

            <Typography variant="caption" className="block text-right mt-1 text-gray-600">
              {new Date(message.createdAt!).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  },
);

export default MessageBubble;
