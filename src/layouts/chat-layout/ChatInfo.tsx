import React from 'react';
import { Paper, Typography } from '@mui/material';
import { GroupChat } from 'interface/Chat';

interface ChatInfoProps {
  selectedGroupChat: GroupChat | null;
}

export const ChatInfo: React.FC<ChatInfoProps> = ({ selectedGroupChat }) => (
  <Paper sx={{ p: 2, height: 'calc(100vh - 100px)', maxHeight: 'calc(100vh - 100px)' }}>
    <Typography variant="h6">Chat Info</Typography>
    <Typography variant="h6" align="center">
      {selectedGroupChat?.chatName}
    </Typography>
    <Typography variant="body2" align="center" color="text.secondary">
      {selectedGroupChat?.chatType}
    </Typography>
  </Paper>
);
