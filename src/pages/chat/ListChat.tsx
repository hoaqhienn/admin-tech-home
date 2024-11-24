import {
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { ChatUser } from 'interface/Chat';

interface Props {
  filteredUsers: ChatUser[];
  selectedUser: any;
  handleChatSelect: any;
}

const ListChat = (props: Props) => {
  const { filteredUsers, selectedUser, handleChatSelect } = props;

  const trimLastMessage = (message: string) => {
    if (message.length > 50) {
      return `${message.slice(0, 50)}...`;
    }
    return message;
  };

  return (
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
  );
};

export default ListChat;
