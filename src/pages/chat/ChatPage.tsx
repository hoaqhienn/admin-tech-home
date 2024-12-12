import {
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useCreateChatMutation } from 'api/chatApi';
import { GroupChat } from 'interface/chat/ChatInterface';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adjust the path for your resident hook
import ListChat from './components/ListChat';
import ChatMessages from './components/ChatMessages';
import { useResidents } from 'hooks/resident/useResident';
import ChatInfo from './components/ChatInfo';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);
  const [openCreateChatForm, setOpenCreateChatForm] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chatType, setChatType] = useState('');
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
  const { residents } = useResidents();
  const [createChat] = useCreateChatMutation();
  const navigate = useNavigate();

  const handleSelectChat = (chat: GroupChat) => {
    setSelectedChat(chat);
  };

  const handleCreateChat = async () => {
    try {
      await createChat({
        chatName,
        chatType,
        residentIds: selectedResidents,
      });
      setOpenCreateChatForm(false);
      // Optionally refresh chat list or do other actions
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Modal open={true} onClose={() => {}} className="h-full w-full">
        <Paper className="w-full h-full" sx={{ borderRadius: 0 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} className="flex flex-row justify-between items-center">
              <Button variant="text" sx={{
                color: 'primary.main',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }} onClick={() => setOpenCreateChatForm(true)}>
                Create New Chat
              </Button>
              <Typography variant="h1">Chat</Typography>
              <IconButton onClick={() => navigate(-1)} size="large" aria-label="Close chat">
                <X size={32} />
              </IconButton>
            </Grid>
            <Grid item xs={2} className="border m-auto">
              <ListChat selectedChat={selectedChat} onSelectChat={handleSelectChat} />
            </Grid>
            <Grid item xs={8} className="border">
              <ChatMessages chatId={selectedChat?.chatId || null} />
            </Grid>
            <Grid item xs={2} className="border">
              <ChatInfo selectedChat={selectedChat} />
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      {/* Create Chat Modal */}
      <Modal
        open={openCreateChatForm}
        onClose={() => setOpenCreateChatForm(false)}
        className="h-full w-full"
      >
        <Paper className="w-full h-full" sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Create New Chat
          </Typography>
          <form>
            <TextField
              label="Chat Name"
              fullWidth
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Chat Type</InputLabel>
              <Select
                value={chatType}
                onChange={(e) => setChatType(e.target.value)}
                label="Chat Type"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="resident">Resident</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Residents</InputLabel>
              <Select
                multiple
                value={selectedResidents}
                onChange={(e) => setSelectedResidents(e.target.value as number[])}
                label="Residents"
              >
                {residents?.map((resident) => (
                  <MenuItem key={resident.residentId} value={resident.residentId}>
                    {resident.fullname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" fullWidth onClick={handleCreateChat} sx={{ marginTop: 2 }}>
              Create Chat
            </Button>
          </form>
        </Paper>
      </Modal>
    </>
  );
};

export default ChatPage;
