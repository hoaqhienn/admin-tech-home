import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { GroupChat } from 'interface/Chat';

interface ChatListProps {
  groupChats: GroupChat[];
  selectedGroupChat: GroupChat | null;
  onChatSelect: (chat: GroupChat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  groupChats,
  selectedGroupChat,
  onChatSelect,
}) => (
  <Paper sx={{ p: 2, height: 'calc(100vh - 100px)', maxHeight: 'calc(100vh - 100px)' }}>
    <List sx={{ overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
      {groupChats.map((chat) => (
        <ListItem
          key={chat.chatId}
          button
          onClick={() => onChatSelect(chat)}
          sx={{
            backgroundColor: selectedGroupChat?.chatId === chat.chatId ? '#e0f7fa' : 'transparent',
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: 'solid',
            marginBottom: 1,
            '&:hover': {
              backgroundColor: selectedGroupChat?.chatId === chat.chatId ? '#b2ebf2' : '#f0f0f0',
            },
          }}
        >
          <ListItemText
            primary={
              <>
                <Typography variant="h6">{chat.chatName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ({chat.chatType})
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);
