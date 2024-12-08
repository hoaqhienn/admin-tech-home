import {
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { ChatMessage, ChatUser } from 'interface/chat/ChatInterface';
import { useState } from 'react';

interface ChatMessagesProps {
  msgs: ChatMessage[];
  currentUserId: number;
  selectedUser: ChatUser;
  setMessages: (messages: ChatMessage[]) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = (props: ChatMessagesProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && props.selectedUser) {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        text: newMessage,
        senderId: props.currentUserId,
        timestamp: new Date().toLocaleTimeString(),
      };
      props.setMessages([...props.msgs, message]);
      setNewMessage('');
    }
  };

  return (
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
        // able auto scroll to bottom
        ref={(ref) => {
          if (ref) {
            ref.scrollTop = ref.scrollHeight;
          }
        }}
        // able scroll chat messages
        sx={{
          overflowY: 'auto',
          height: 'calc(100vh - 200px)',
        }}
      >
        {props.msgs.map((msg) => (
          <ListItem
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.senderId === props.currentUserId ? 'flex-end' : 'flex-start',
            }}
          >
            <ListItemText
              primary={<Typography variant="body1">{msg.text}</Typography>}
              sx={{
                backgroundColor: msg.senderId === props.currentUserId ? '#d1f7c4' : '#f1f1f1',
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
  );
};

export default ChatMessages;
