import { useState } from 'react';
import { Badge, IconButton, Modal, Box } from '@mui/material';
import { PropsWithChildren } from 'react';
import { MessageCircle, X } from 'lucide-react';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '100%',
  height: '100%',
  maxHeight: '100%',
  bgcolor: '#f6f6f6',
  boxShadow: 24,
  p: 1,
};

const ChatLayout = ({ children }: PropsWithChildren) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);

  // Handlers
  const handleChatOpen = () => setIsOpen(true);
  const handleChatClose = () => setIsOpen(false);

  return (
    <>
      <IconButton onClick={handleChatOpen} size="large" aria-label="Open chat">
        <Badge color="error">
          <MessageCircle />
        </Badge>
      </IconButton>

      <Modal
        open={isOpen}
        onClose={handleChatClose}
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
            onClick={handleChatClose}
            size="large"
            aria-label="Close chat"
          >
            <X />
          </IconButton>

          {children}
        </Box>
      </Modal>
    </>
  );
};

export default ChatLayout;
