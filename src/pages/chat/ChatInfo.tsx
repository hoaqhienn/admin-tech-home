import { Avatar, Paper, Typography } from '@mui/material';
import { ChatUser } from 'interface/chat/ChatInterface';


interface Props {
  info: ChatUser;
}

const ChatInfo: React.FC<Props> = ({ info }) => {
  return (
    <Paper
      sx={{
        p: 2,
        height: 'calc(100vh - 100px)',
        maxHeight: 'calc(100vh - 100px)',
      }}
    >
      <Typography variant="h6">Chat Info</Typography>
      <Avatar
        src={info.avatar || 'https://via.placeholder.com/150'}
        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h6" align="center">
        {info.name}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary">
        {info.online ? 'Online' : 'Offline'}
      </Typography>
    </Paper>
  );
};

export default ChatInfo;
