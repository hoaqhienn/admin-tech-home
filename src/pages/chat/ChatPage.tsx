import { Grid, IconButton, Modal, Paper, Typography } from '@mui/material';
import { GroupChat } from 'interface/chat/ChatInterface';
import { X } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessages from './components/ChatMessages';
import ListChat from './components/ListChat';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = React.useState<GroupChat | null>(null);
  const navigate = useNavigate();

  const handleSelectChat = (chat: GroupChat) => {
    setSelectedChat(chat);
  };

  return (
    <Modal open={true} onClose={() => {}} className="h-full w-full">
      <Paper
        className="w-full h-full"
        sx={{
          borderRadius: 0,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} className="flex flex-row justify-between items-center">
            <Typography variant="h1">Chat</Typography>
            <IconButton onClick={() => navigate(-1)} size="large" aria-label="Close chat">
              <X size={32} />
            </IconButton>
          </Grid>
          <Grid item xs={3} className="border m-auto">
            <ListChat selectedChat={selectedChat} onSelectChat={handleSelectChat} />
          </Grid>
          <Grid item xs={9} className="border">
            <ChatMessages chatId={selectedChat?.chatId || null} />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default ChatPage;
