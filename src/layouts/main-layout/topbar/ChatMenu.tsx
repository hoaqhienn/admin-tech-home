import React, { useState } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import {
  Avatar,
  Badge,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

interface ChatMenuProps {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
  online: boolean;
}

const chatItems: ChatMenuProps[] = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Hello, how are you? I was wondering if you could help me with a problem I have.',
    lastMessageTime: '12:00',
    unreadMessageCount: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Jane Doe',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Hi',
    lastMessageTime: '12:00',
    unreadMessageCount: 1,
    online: false,
  },
  {
    id: 3,
    name: 'John Smith',
    avatar: '',
    lastMessage: 'Hey',
    lastMessageTime: '12:00',
    unreadMessageCount: 5,
    online: true,
  },
];

const ChatMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatMenuProps | null>(null);

  const handleChatOpen = () => {
    setOpen(true);
  };

  const handleChatClose = () => {
    setOpen(false);
    setSelectedChat(null);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      // You would send the message to your backend here
      console.log(`Message sent to ${selectedChat.name}: ${message}`);
      setMessage('');
    }
  };

  const handleChatSelect = (chat: ChatMenuProps) => {
    setSelectedChat(chat);
  };

  return (
    <>
      <IconButton onClick={handleChatOpen} size="large">
        <Badge badgeContent={2} color="error">
          <IconifyIcon icon="ic:outline-message" />
        </Badge>
      </IconButton>
      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={open}
        onClose={handleChatClose}
      >
        <Paper
          sx={{
            width: '90%',
            maxWidth: '90%',
            height: '90%',
            maxHeight: '90%',
            position: 'relative',
            padding: 2,
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
            onClick={handleChatClose}
            size="large"
          >
            <IconifyIcon icon="ic:outline-close" />
          </IconButton>
          <Grid container>
            <Grid item xs={12}>
              <div className="flex flex-row items-center space-x-1">
                <Typography variant="h4">Chats</Typography>
                <TextField
                  variant="filled"
                  placeholder="Search"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="eva:search-fill" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={4} md={4}>
              <Box
                sx={{
                  maxHeight: 'calc(100vh - 160px)',
                  overflowY: 'auto',
                  paddingRight: 1,
                }}
              >
                <List>
                  {chatItems.map((chat) => (
                    <ListItem key={chat.id} button onClick={() => handleChatSelect(chat)}>
                      <ListItemAvatar>
                        <Badge
                          variant="dot"
                          color={chat.online ? 'success' : 'default'}
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Avatar src={chat.avatar} />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {chat.lastMessage}
                            </Typography>
                            {' — '}
                            {chat.lastMessageTime}
                          </>
                        }
                      />
                      {chat.unreadMessageCount > 0 && (
                        <Badge color="error" badgeContent={chat.unreadMessageCount} />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={8} md={8}>
              {selectedChat ? (
                <>
                  <Typography variant="h6">Chat with {selectedChat.name}</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      height: 'calc(100vh - 200px)',
                    }}
                  >
                    <TextField
                      variant="outlined"
                      placeholder="Type a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleSendMessage}>
                              <IconifyIcon icon="ic:outline-send" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </>
              ) : (
                <Typography variant="h6">Select a chat to start messaging</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

export default ChatMenu;
