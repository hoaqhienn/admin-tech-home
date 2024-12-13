import React from 'react';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useGetAllChatsQuery, useDeleteChatMutation } from 'api/chatApi';
import { GroupChat } from 'interface/chat/ChatInterface';
import { Delete } from 'lucide-react';

const ListChat = React.memo(
  ({
    selectedChat,
    onSelectChat,
  }: {
    selectedChat: GroupChat | null;
    onSelectChat: (chat: GroupChat) => void;
  }) => {
    const { data: chats, isLoading, error } = useGetAllChatsQuery();
    const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [chatToDelete, setChatToDelete] = React.useState<number | null>(null);

    const handleDeleteClick = (chatId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setChatToDelete(chatId);
      setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
      if (chatToDelete) {
        try {
          await deleteChat({ chatId: chatToDelete }).unwrap();
          setDeleteDialogOpen(false);
          setChatToDelete(null);
        } catch (err) {
          console.error('Failed to delete chat:', err);
        }
      }
    };

    if (isLoading) {
      return (
        <Box className="flex justify-center items-center h-full">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box className="p-4">
          <Typography color="error" className="text-center">
            Unable to load chats. Please try again later.
          </Typography>
        </Box>
      );
    }

    const chatsList = Array.isArray(chats) ? chats : [];

    return (
      <>
        <List
          className="h-full overflow-y-auto"
          sx={{
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          {chatsList.length === 0 ? (
            <Box className="p-4">
              <Typography className="text-center text-gray-500">No chats available yet</Typography>
            </Box>
          ) : (
            chatsList.map((chat) => (
              <ListItem
                key={chat.chatId}
                onClick={() => onSelectChat(chat)}
                className={`
                mb-2 cursor-pointer rounded-lg border
                transition-all duration-200 hover:translate-x-1
                ${
                  selectedChat?.chatId === chat.chatId
                    ? 'border-l-4 border-l-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }
              `}
              >
                <ListItemText
                  primary={
                    <Box className="flex items-center justify-between">
                      <Typography variant="subtitle2" className="font-medium">
                        {chat.chatName}
                      </Typography>
                      <IconButton
                        onClick={(e) => handleDeleteClick(chat.chatId, e)}
                        disabled={isDeleting}
                        className="text-gray-500 hover:text-red-500"
                        size="small"
                      >
                        <Delete size={18} />
                      </IconButton>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      className="mt-1 text-gray-600"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {chat.chatType} Chat
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Xóa Chat</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa cuộc trò chuyện này không? Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
);

ListChat.displayName = 'ListChat';

export default ListChat;
