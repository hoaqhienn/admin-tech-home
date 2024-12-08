import React, { useCallback, useEffect, useRef } from 'react';
import { ListItemAvatar, Typography } from '@mui/material';
import { CustomFile } from 'interface/chat/ChatInterface';

const FileAttachments = React.memo(
  ({
    files,
    onImageClick,
  }: {
    files: CustomFile[];
    onImageClick: (files: string[], index: number) => void;
  }) => {
    const imageFiles = files.filter((f) => f.fileType === 'image');

    return (
      <div className="flex flex-row gap-2 flex-wrap mt-2">
        {files.map((file, index) => {
          if (file.fileType === 'image') {
            return (
              <img
                key={file.fileId}
                src={file.fileUrl}
                alt={`File ${index + 1}`}
                className="w-20 h-20 rounded cursor-pointer hover:opacity-80 transition-opacity"
                loading="lazy"
                onClick={() =>
                  onImageClick(
                    imageFiles.map((f) => f.fileUrl),
                    imageFiles.findIndex((f) => f.fileId === file.fileId),
                  )
                }
              />
            );
          }
          return null;
        })}
      </div>
    );
  },
);

FileAttachments.displayName = 'FileAttachments';

const Message = React.memo(
  ({
    message,
    onImageClick,
  }: {
    message: any;
    onImageClick: (files: string[], index: number) => void;
  }) => (
    <div className={`flex ${message.senderId === -1 ? 'justify-end' : 'justify-start'} py-2`}>
      <ListItemAvatar className="flex items-center">
        <img src={message.avatar} alt="avatar" className="w-10 h-10 rounded-full" loading="lazy" />
      </ListItemAvatar>
      <div
        className={`rounded-lg px-4 py-2 max-w-[70%] ${
          message.senderId === -1 ? 'bg-blue-100' : 'bg-gray-100'
        }`}
      >
        <Typography variant="body1" component="div">
          {message.content}
        </Typography>
        {message.Files?.length > 0 && (
          <FileAttachments files={message.Files} onImageClick={onImageClick} />
        )}
      </div>
    </div>
  ),
);

Message.displayName = 'Message';

const MessageList = ({
  messages,
  onImageClick,
}: {
  messages: any[];
  onImageClick: (files: string[], index: number) => void;
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const isAutoScrollEnabled = useRef(true);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      isAutoScrollEnabled.current = isNearBottom;
    }
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (listRef.current) {
      const scrollHeight = listRef.current.scrollHeight;
      listRef.current.scrollTo({
        top: scrollHeight,
        behavior,
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current && isAutoScrollEnabled.current) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
    prevMessagesLength.current = messages.length;
  }, [messages, scrollToBottom]);

  const visibleMessages = useCallback(() => {
    if (!listRef.current) return messages;
    const list = listRef.current;
    const scrollTop = list.scrollTop;
    const viewportHeight = list.clientHeight;
    const itemHeight = 80;

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      Math.ceil((scrollTop + viewportHeight) / itemHeight),
      messages.length,
    );

    return messages.slice(Math.max(0, startIndex - 5), endIndex + 5);
  }, [messages]);

  return (
    <div
      ref={listRef}
      className="overflow-y-auto h-[calc(100vh-200px)] scroll-smooth"
      onScroll={handleScroll}
    >
      {visibleMessages().map((message, index) => (
        <div ref={index === messages.length - 1 ? lastMessageRef : null} key={message.messageId}>
          <Message message={message} onImageClick={onImageClick} />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
