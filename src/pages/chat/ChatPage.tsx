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
import { PlusCircleIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListChat from './components/ListChat';
import ChatMessages from './components/ChatMessages';
import { useResidents } from 'hooks/resident/useResident';
import ChatInfo from './components/ChatInfo';

const CreateChatModal = ({
  open,
  onClose,
  onSubmit,
  residents,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (chatName: string, chatType: string, residentIds: number[]) => void;
  residents: { residentId: number; fullname: string }[];
}) => {
  const [chatName, setChatName] = useState('');
  const [chatType, setChatType] = useState('');
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);

  const handleSubmit = () => {
    onSubmit(chatName, chatType, selectedResidents);
    setChatName('');
    setChatType('');
    setSelectedResidents([]);
  };

  return (
    <Modal open={open} onClose={onClose} className="flex h-full w-full justify-center items-center">
      <Paper sx={{ maxWidth: 'auto', maxHeight: 'auto', margin: 'auto', padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Tạo Chat Mới
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
              {residents.map((resident) => (
                <MenuItem key={resident.residentId} value={resident.residentId}>
                  {resident.fullname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ marginTop: 2 }}>
            Tạo chat
          </Button>
        </form>
      </Paper>
    </Modal>
  );
};

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);
  const [openCreateChatForm, setOpenCreateChatForm] = useState(false);
  const { residents } = useResidents();
  const [createChat] = useCreateChatMutation();
  const navigate = useNavigate();

  const handleCreateChat = async (chatName: string, chatType: string, residentIds: number[]) => {
    try {
      await createChat({ chatName, chatType, residentIds });
      setOpenCreateChatForm(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <>
      <Modal open={true} onClose={() => {}} className="h-screen w-full">
        <Paper sx={{ height: '100%', borderRadius: 0 }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={12} className="flex flex-row justify-between items-start">
              <Button
                variant="text"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
                onClick={() => setOpenCreateChatForm(true)}
              >
                <PlusCircleIcon />
              </Button>
              <Typography variant="h1">Chat</Typography>
              <IconButton onClick={() => navigate(-1)} size="large" aria-label="Close chat">
                <X size={32} />
              </IconButton>
            </Grid>
            <Grid container sx={{ height: '95%' }}>
              <Grid item xs={2} className="border" sx={{ height: '100%', overflowY: 'auto' }}>
                <ListChat selectedChat={selectedChat} onSelectChat={setSelectedChat} />
              </Grid>
              <Grid item xs={8} className="border" sx={{ height: '100%', overflowY: 'auto' }}>
                <ChatMessages chatId={selectedChat?.chatId || null} />
              </Grid>
              <Grid item xs={2} className="border" sx={{ height: '100%', overflowY: 'auto' }}>
                <ChatInfo selectedChat={selectedChat} />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      <CreateChatModal
        open={openCreateChatForm}
        onClose={() => setOpenCreateChatForm(false)}
        onSubmit={handleCreateChat}
        residents={residents || []}
      />
    </>
  );
};

export default ChatPage;
