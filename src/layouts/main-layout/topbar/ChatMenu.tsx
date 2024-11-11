import React, { useEffect, useRef, useState } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import {
  Avatar,
  Badge,
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

interface ChatMessage {
  id: string;
  text: string;
  senderId: number;
  timestamp: string;
}

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
  online: boolean;
}

const chatUsers: ChatUser[] = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
    lastMessage:
      'Hello, how are you? I was wondering if you could help me with a problem I have. I am trying to do something and I am having trouble with it. I was wondering if you could help me with it. I would really appreciate it. Thank you.',
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
  {
    id: 4,
    name: 'Jane Smith',
    avatar: '',
    lastMessage: 'Hello',
    lastMessageTime: '12:00',
    unreadMessageCount: 0,
    online: false,
  },
  {
    id: 5,
    name: 'John Doe',
    avatar: '',
    lastMessage: 'Hi',
    lastMessageTime: '12:00',
    unreadMessageCount: 0,
    online: true,
  },
  {
    id: 6,
    name: 'Jane Doe',
    avatar: '',
    lastMessage: 'Hello',
    lastMessageTime: '12:00',
    unreadMessageCount: 0,
    online: false,
  },
  {
    id: 7,
    name: 'John Smith',
    avatar: '',
    lastMessage: 'Hey',
    lastMessageTime: '12:00',
    unreadMessageCount: 0,
    online: true,
  },
  {
    id: 8,
    name: 'Davi Smith',
    avatar: '',
    lastMessage: 'Hello',
    lastMessageTime: '12:00',
    unreadMessageCount: 0,
    online: false,
  },
];

const currentUserId = -1;

const ChatMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(chatUsers);

  const timeoutRef = useRef<number>();

  useEffect(() => {
    // Filter users based on search query
    const filtered = chatUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedUser) return;

    const loadInitialMessages = async () => {
      setIsLoading(true);
      try {
        const initialMessages: ChatMessage[] = [
          {
            id: crypto.randomUUID(),
            text: selectedUser.lastMessage,
            senderId: selectedUser.id,
            timestamp: new Date().toLocaleTimeString(),
          },
        ];
        setMessages(initialMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessages();

    return () => {
      setMessages([]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser || isLoading) return;

    const simulateIncomingMessage = () => {
      const randomResponses = [
        'Thanks for your message!',
        "I'll get back to you soon.",
        'Got it, thanks!',
        'Let me check and get back to you.',
        "I'm not sure, let me check.",
        "I'll get back to you soon.",
      ];

      timeoutRef.current = window.setTimeout(
        () => {
          const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: randomResponses[Math.floor(Math.random() * randomResponses.length)],
            senderId: selectedUser.id,
            timestamp: new Date().toLocaleTimeString(),
          };

          setMessages((prev) => [...prev, newMessage]);
        },
        Math.random() * 10000 + 5000,
      );
    };

    simulateIncomingMessage();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedUser, messages, isLoading]);

  const handleChatOpen = () => {
    setIsOpen(true);
  };

  const handleChatClose = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        text: newMessage,
        senderId: currentUserId,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleChatSelect = (chat: ChatUser) => {
    setSelectedUser(chat);
  };

  const trimLastMessage = (message: string) => {
    return message.length > 70 ? message.substring(0, 70) + '...' : message;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <IconButton onClick={handleChatOpen} size="large">
        <Badge
          badgeContent={chatUsers.reduce((acc, user) => acc + user.unreadMessageCount, 0)}
          color="error"
        >
          <IconifyIcon icon="ic:outline-message" />
        </Badge>
      </IconButton>
      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={isOpen}
        onClose={handleChatClose}
      >
        <Paper
          sx={{
            width: '95%',
            maxWidth: '95%',
            height: '95%',
            maxHeight: '95%',
            position: 'relative',
            padding: 1,
            backgroundColor: '#f6f6f6',
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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className="flex flex-row items-center space-x-1">
                <Typography variant="h4">Chats</Typography>
                <TextField
                  variant="filled"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: 280,
                    display: { xs: 'none', md: 'flex' },
                  }}
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
            <Grid item md={3}>
              <List
                sx={{
                  overflowY: 'auto',
                  height: 'calc(100vh - 100px)',
                }}
              >
                {filteredUsers.map((chat) => (
                  <ListItem
                    key={chat.id}
                    button
                    onClick={() => handleChatSelect(chat)}
                    sx={{
                      backgroundColor: selectedUser?.id === chat.id ? '#e0f7fa' : 'transparent',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderStyle: 'solid',
                      marginBottom: 1,
                      '&:hover': {
                        backgroundColor: selectedUser?.id === chat.id ? '#b2ebf2' : '#f0f0f0',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        variant="dot"
                        color={chat.online ? 'success' : 'default'}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      >
                        <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="h6">
                            {chat.name} {chat.lastMessageTime}
                          </Typography>
                        </>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {trimLastMessage(chat.lastMessage)}
                          </Typography>
                        </>
                      }
                    />
                    {chat.unreadMessageCount > 0 && (
                      <Badge
                        sx={{
                          position: 'absolute',
                          top: 15,
                          right: 15,
                        }}
                        color="error"
                        badgeContent={chat.unreadMessageCount}
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item md={6}>
              {selectedUser ? (
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: 'calc(100vh - 100px)',
                    maxHeight: 'calc(100vh - 100px)',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                  }}
                >
                  <List
                    // anable auto scroll to bottom
                    ref={(ref) => {
                      if (ref) {
                        ref.scrollTop = ref.scrollHeight;
                      }
                    }}
                    // anable scroll chat messages
                    sx={{
                      overflowY: 'auto',
                      height: 'calc(100vh - 200px)',
                    }}
                  >
                    {messages.map((msg) => (
                      <ListItem
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          justifyContent:
                            msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <ListItemText
                          primary={<Typography variant="body1">{msg.text}</Typography>}
                          sx={{
                            backgroundColor: msg.senderId === currentUserId ? '#d1f7c4' : '#f1f1f1',
                            borderRadius: 5,
                            padding: '8px 16px',
                            maxWidth: '70%',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <TextField
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    rows={3}
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
                </Paper>
              ) : (
                <Typography variant="h6">Select a chat to start messaging</Typography>
              )}
            </Grid>
            <Grid item md={3}>
              {selectedUser && (
                <Paper
                  sx={{
                    p: 2,
                    height: 'calc(100vh - 100px)',
                    maxHeight: 'calc(100vh - 100px)',
                  }}
                >
                  <Typography variant="h6">Chat Info</Typography>
                  <Avatar
                    src={selectedUser.avatar || 'https://via.placeholder.com/150'}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" align="center">
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {selectedUser.online ? 'Online' : 'Offline'}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

export default ChatMenu;
