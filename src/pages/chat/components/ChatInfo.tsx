import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { UserMinus, UserPlus, Users, Search } from 'lucide-react';
import { GroupChat } from 'interface/chat/ChatInterface';
import { useRemoveMemberMutation, useAddMemberMutation } from 'api/chatApi';
import { useResidents } from 'hooks/resident/useResident';

interface ChatInfoProps {
  selectedChat: GroupChat | null;
}

const ChatInfo = ({ selectedChat }: ChatInfoProps) => {
  // Queries and Mutations
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const { residents, isLoading: isLoadingResidents } = useResidents();

  // Local State
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = React.useState<number | null>(null);
  const [selectedResidents, setSelectedResidents] = React.useState<number[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  if (!selectedChat) {
    return (
      <Box className="h-full flex items-center justify-center p-4">
        <Typography color="text.secondary" align="center">
          Select a chat to view information
        </Typography>
      </Box>
    );
  }

  // Filter out existing members
  const availableResidents =
    residents?.filter(
      (resident) => !selectedChat.members?.some((member) => member.userId === resident.residentId),
    ) || [];

  const filteredResidents = availableResidents.filter((resident) =>
    resident.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRemoveMember = async () => {
    if (selectedMemberId && selectedChat) {
      try {
        const result = await removeMember({
          chatId: selectedChat.chatId,
          memberId: selectedMemberId,
        }).unwrap();

        console.log(result);

        // // Emit socket event for member removal
        // emitMemberRemoved(selectedChat.chatId, {
        //   ...result,
        //   removedMemberId: selectedMemberId,
        // });

        setSnackbar({
          open: true,
          message: 'Member removed successfully',
          severity: 'success',
        });

        setOpenConfirmDialog(false);
        setSelectedMemberId(null);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to remove member',
          severity: 'error',
        });
      }
    }
  };

  const handleAddMembers = async () => {
    if (selectedChat && selectedResidents.length > 0) {
      try {
        // Add members sequentially
        const results = await Promise.all(
          selectedResidents.map((residentId) =>
            addMember({
              chatId: selectedChat.chatId,
              memberId: residentId,
            }).unwrap(),
          ),
        );

        // Emit socket event for the final state
        if (results.length > 0) {
          console.log(results);

          // const finalResult = results[results.length - 1];
          // emitMemberAdded(selectedChat.chatId, finalResult);
        }

        setSnackbar({
          open: true,
          message: `Successfully added ${selectedResidents.length} member(s)`,
          severity: 'success',
        });

        setOpenAddMemberDialog(false);
        setSelectedResidents([]);
        setSearchTerm('');
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to add members',
          severity: 'error',
        });
      }
    }
  };
  const handleToggleResident = (residentId: number) => {
    setSelectedResidents((prev) =>
      prev.includes(residentId) ? prev.filter((id) => id !== residentId) : [...prev, residentId],
    );
  };

  const openRemoveDialog = (memberId: number) => {
    setSelectedMemberId(memberId);
    setOpenConfirmDialog(true);
  };

  return (
    <Box className="h-full flex flex-col p-4">
      {/* Chat Information Section */}
      <Box className="mb-6">
        <Box className="flex items-center gap-2 mb-4">
          <Avatar className="w-16 h-16 text-2xl">
            {selectedChat.chatName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" className="font-bold">
              {selectedChat.chatName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {selectedChat.chatType} Chat
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Members Section */}
      <Box className="mt-4 flex-1 overflow-auto">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <Users size={20} />
            <Typography variant="h6">Members ({selectedChat.members?.length || 0})</Typography>
          </Box>
          <Button
            startIcon={<UserPlus size={18} />}
            variant="text"
            size="small"
            onClick={() => setOpenAddMemberDialog(true)}
          >
            Add Member
          </Button>
        </Box>

        <List>
          {selectedChat.members?.map((member) => (
            <ListItem
              key={member.userId}
              secondaryAction={
                selectedChat.chatType === 'admin' && (
                  <IconButton
                    edge="end"
                    onClick={() => openRemoveDialog(member.userId)}
                    className="text-gray-500 hover:text-red-500"
                    disabled={isRemoving}
                  >
                    <UserMinus size={18} />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar>{member.fullname.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.fullname} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Remove Member Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => !isRemoving && setOpenConfirmDialog(false)}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this member from the chat?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} disabled={isRemoving}>
            Cancel
          </Button>
          <Button
            onClick={handleRemoveMember}
            color="error"
            variant="contained"
            disabled={isRemoving}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog
        open={openAddMemberDialog}
        onClose={() => !isAdding && setOpenAddMemberDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Members</DialogTitle>
        <DialogContent>
          {/* Search Box */}
          <Box className="mb-4 mt-2">
            <Box className="flex items-center gap-2 p-2 border rounded">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none border-none bg-transparent"
              />
            </Box>
          </Box>

          {isLoadingResidents ? (
            <Box className="flex justify-center p-4">
              <CircularProgress />
            </Box>
          ) : filteredResidents.length === 0 ? (
            <Typography color="text.secondary" align="center" className="py-4">
              {searchTerm ? 'No matching residents found' : 'No residents available to add'}
            </Typography>
          ) : (
            <List className="max-h-96 overflow-y-auto">
              {filteredResidents.map((resident) => (
                <ListItem
                  key={resident.residentId}
                  dense
                  button
                  onClick={() => handleToggleResident(resident.residentId)}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedResidents.includes(resident.residentId)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemAvatar>
                    <Avatar>{resident.fullname.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={resident.fullname} secondary={resident.email} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMemberDialog(false)} disabled={isAdding}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            variant="contained"
            disabled={selectedResidents.length === 0 || isAdding}
          >
            {isAdding ? `Adding Members...` : `Add Selected (${selectedResidents.length})`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatInfo;
