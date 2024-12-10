import { Avatar, Box, Typography } from '@mui/material';
import { Messages } from 'interface/chat/ChatInterface';
import React from 'react';
import FileAttachment from './FileAttachment';

const MessageBubble = React.memo(
  ({
    message,
    currentUserId,
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
  }) => {
    const isOwnMessage = message.senderId === currentUserId;

    return (
      <Box
        className={`flex gap-2 items-start max-w-[70%] ${isOwnMessage ? 'self-end' : 'self-start'}`}
      >
        {!isOwnMessage && (
          <Avatar className="w-8 h-8">{message.senderId?.toString().charAt(0)}</Avatar>
        )}
        <Box className={`p-3 rounded-lg relative ${isOwnMessage ? 'bg-blue-50' : 'bg-gray-100'}`}>
          <Box className={`p-3 rounded-lg relative ${isOwnMessage ? 'bg-blue-50' : 'bg-gray-100'}`}>
            {!isOwnMessage && (
              <Typography variant="caption" className="font-bold">
                {message.senderId}
              </Typography>
            )}
            {message.content && <Typography variant="body1">{message.content}</Typography>}
            <Typography variant="caption" className="block text-right mt-1 text-gray-600">
              {new Date(message.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>

          {/* File attachments */}
          {message.Files && message.Files.length > 0 && (
            <Box className="mt-2 space-y-2">
              {message.Files.map((file) => (
                <FileAttachment key={file.fileId} file={file} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  },
);

export default MessageBubble;
