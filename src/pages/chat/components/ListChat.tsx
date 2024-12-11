import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useGetAllChatsQuery } from 'api/chatApi';
import { GroupChat } from 'interface/chat/ChatInterface';
import React from 'react';

const ListChat = React.memo(
  ({
    selectedChat,
    onSelectChat,
  }: {
    selectedChat: GroupChat | null;
    onSelectChat: (chat: GroupChat) => void;
  }) => {
    const { data: chats, isLoading, error } = useGetAllChatsQuery();
    console.log('chats:: ', chats);

    if (isLoading) {
      return (
        <Box className="flex justify-center items-center p-4">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box className="p-4">
          <Typography color="error">Failed to load chats</Typography>
        </Box>
      );
    }

    // Ensure chats is an array
    const chatsList = Array.isArray(chats) ? chats : [];

    return (
      <List>
        {chatsList.length === 0 ? (
          <Box className="p-4">
            <Typography>No chats available</Typography>
          </Box>
        ) : (
          chatsList.map((chat) => (
            <ListItem
              key={chat.chatId}
              onClick={() => onSelectChat(chat)}
              sx={{
                // if is selected chat, add border to left
                borderLeft: selectedChat?.chatId === chat.chatId ? '4px solid blue' : '1px solid lightgrey',
              }}
              className={`border rounded-lg mb-1 cursor-pointer transition-all duration-200 hover:translate-x-1 ${
                selectedChat?.chatId === chat.chatId
                  ? 'bg-primary-light'
                  : 'bg-background-paper hover:bg-action-hover'
              } `}
            >
              <Avatar className="mr-2">{chat.chatName.charAt(0).toUpperCase()}</Avatar>
              <ListItemText
                primary={
                  <Box className="flex justify-between items-center">
                    <Typography variant="subtitle1" className="font-medium">
                      {chat.chatName}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {chat.chatType}
                  </Typography>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    );
  },
);

export default ListChat;
