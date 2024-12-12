import Grid from '@mui/material/Grid';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import EventDataGrid from './EventDataGrid';
import { useState } from 'react';
import EventDialog from './EventDialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  useAddEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
} from 'api/serviceApi';
import { NewEvent } from 'interface/Utils';

const Events = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<NewEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [eventsToDelete, setEventsToDelete] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleOpenAddDialog = () => {
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (event: NewEvent) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (event: NewEvent) => {
    try {
      if (selectedEvent) {
        await updateEvent({ id: selectedEvent.eventId!, event }).unwrap();
        showSnackbar('Event updated successfully', 'success');
      } else {
        await addEvent(event).unwrap();
        showSnackbar('Event added successfully', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showSnackbar('An error occurred while saving the event', 'error');
    }
  };

  const handleDelete = (id: number) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete).unwrap();
        showSnackbar('Event deleted successfully', 'success');
      } catch (error) {
        showSnackbar('An error occurred while deleting the event', 'error');
      }
    }
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleBulkDelete = (ids: number[]) => {
    setEventsToDelete(ids);
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await Promise.all(eventsToDelete.map((id) => deleteEvent(id).unwrap()));
      showSnackbar(`${eventsToDelete.length} events deleted successfully`, 'success');
    } catch (error) {
      showSnackbar('An error occurred while deleting events', 'error');
    }
    setBulkDeleteDialogOpen(false);
    setEventsToDelete([]);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h1">Danh sách sự kiện</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
            Thêm sự kiện
          </Button>
        </Grid>
        <Grid item xs={12}>
          <EventDataGrid
            onEdit={handleOpenEditDialog}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        </Grid>
      </Grid>

      {openDialog && (
        <EventDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          event={selectedEvent}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xóa sự kiện này không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa nhiều sự kiện</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa {eventsToDelete.length} sự kiện đã chọn không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmBulkDelete} color="error" autoFocus>
            Xóa tất cả
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Events;
