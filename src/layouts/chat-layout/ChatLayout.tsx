import {
  Badge,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { MessagePanelProps } from 'interface/Chat';
import { ChatList } from './ChatList';
import { ChatInfo } from './ChatInfo';
import { ImageGallery } from './ImageGallery';
import { MessageList } from './MessageList';
import { useChatData, useChatHandlers, useChatState } from 'hooks/useChatState';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: '95%',
  height: '95%',
  maxHeight: '95%',
  bgcolor: '#f6f6f6',
  boxShadow: 24,
  p: 1,
};

const ChatHeader: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => (
  <Box className="flex flex-row items-center space-x-1">
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
  </Box>
);

const MessagePanel: React.FC<MessagePanelProps> = ({
  messages,
  newMessage,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  onImageClick,
}) => (
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
    <MessageList messages={messages} onImageClick={onImageClick} />
    <TextField
      variant="outlined"
      placeholder="Type a message"
      value={newMessage}
      onChange={onMessageChange}
      onKeyPress={onKeyPress}
      multiline
      rows={3}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onSendMessage}>
              <IconifyIcon icon="ic:outline-send" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  </Paper>
);

const ChatLayout: React.FC = () => {
  const state = useChatState();
  const handlers = useChatHandlers(state);
  useChatData(state);

  return (
    <>
      <IconButton onClick={handlers.handleChatOpen} size="large">
        <Badge color="error">
          <IconifyIcon icon="ic:outline-message" />
        </Badge>
      </IconButton>

      <Modal
        open={state.isOpen}
        onClose={handlers.handleChatClose}
        aria-labelledby="chat-modal"
        aria-describedby="chat-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
            onClick={handlers.handleChatClose}
            size="large"
          >
            <IconifyIcon icon="ic:outline-close" />
          </IconButton>

          <Grid container spacing={1}>
            <Grid item md={12} xs={12}>
              <ChatHeader searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery} />
            </Grid>

            <Grid item md={3} xs={3}>
              <ChatList
                groupChats={state.groupChats}
                selectedGroupChat={state.selectedGroupChat}
                onChatSelect={handlers.handleChatSelect}
              />
            </Grid>

            <Grid item md={6} xs={6}>
              <MessagePanel
                messages={state.messages}
                newMessage={state.newMessage}
                onMessageChange={(e) => state.setNewMessage(e.target.value)}
                onKeyPress={handlers.handleKeyPress}
                onSendMessage={handlers.handleSendMessage}
                onImageClick={handlers.handleImageClick}
              />
            </Grid>

            <Grid item md={3} xs={3}>
              <ChatInfo selectedGroupChat={state.selectedGroupChat} />
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={state.galleryState.isOpen}
        onClose={handlers.handleGalleryClose}
        aria-labelledby="image-gallery-modal"
        aria-describedby="image-gallery-modal-description"
      >
        <Box sx={modalStyle}>
          <ImageGallery
            files={state.messages.flatMap((msg) => msg.Files)}
            initialIndex={state.galleryState.currentIndex}
            onClose={handlers.handleGalleryClose}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ChatLayout;
