import React from 'react';
import { List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { CustomFile, MessageListProps } from 'interface/Chat';
import { VideoPlayer } from './VideoPlayer';

const FileAttachments: React.FC<{
  files: CustomFile[];
  onImageClick: (files: string[], index: number) => void;
}> = ({ files, onImageClick }) => {
  const imageFiles = files.filter((f) => f.fileType === 'image');

  return (
    <div className="flex flex-row gap-2 flex-wrap mt-2">
      {files.map((file: CustomFile, index: number) => {
        switch (file.fileType) {
          case 'image':
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
          case 'video':
            return (
              <VideoPlayer
                key={file.fileId}
                src={file.fileUrl}
                className="w-[500px] h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
              />
            );
          case 'document':
            return (
              <div key={file.fileId} className="flex items-center gap-2">
                <IconifyIcon icon="akar-icons:file" className="text-4xl" />
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  {file.fileName}.pdf
                </a>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export const MessageList: React.FC<MessageListProps> = React.memo(({ messages, onImageClick }) => {
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <List ref={listRef} className="overflow-y-auto h-[calc(100vh-200px)]">
      {messages.map((msg) => (
        <ListItem
          key={msg.messageId}
          className={`flex ${msg.senderId === -1 ? 'justify-end' : 'justify-start'}`}
        >
          <ListItemAvatar className="flex items-center">
            <img src={msg.avatar} alt="avatar" className="w-10 h-10 rounded-full" loading="lazy" />
          </ListItemAvatar>
          <div
            className={`rounded-lg px-4 py-2 max-w-[70%] ${
              msg.senderId === -1 ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <Typography variant="body1" component="div">
              {msg.content}
            </Typography>
            {msg.Files && msg.Files.length > 0 && (
              <FileAttachments files={msg.Files} onImageClick={onImageClick} />
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
});

MessageList.displayName = 'MessageList';
