import Grid from '@mui/material/Grid';
import { Alert, Button, Snackbar, Stack, Typography } from '@mui/material';
import NotifyDataGrid from './NotifyDataGrid';
import { useCallback, useState } from 'react';
import { ResidentViaApartment } from 'interface/Residents';
import { NewNotify, Notify } from 'interface/Utils';
import {
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useSendNotificationMutation,
  useUpdateNotificationMutation,
} from 'api/serviceApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import NotifyFormDialog from './NotifyFormDialog';
import ResidentSelectionDialog from './ResidentSelectionDialog ';
import { useResidents } from 'hooks/resident/useResident';

const NotifyPage = () => {
  const [notify, setNotify] = useState<Notify | null>(null);
  const [current, setCurrent] = useState<Notify | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notify | null>(null);
  const [residentSelectionDialogOpen, setResidentSelectionDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [deleteNotify] = useDeleteNotificationMutation();
  const [addNotification] = useAddNotificationMutation();
  const [updateNotification] = useUpdateNotificationMutation();
  const [sendNotification] = useSendNotificationMutation();

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const { residents } = useResidents();

  const handleSelectResidents = async (selectedResidents: ResidentViaApartment[]) => {
    const selectedResidentIds = selectedResidents.map((resident) => resident.residentId);

    // If notify object exists, call sendNotification with selected residents
    if (notify) {
      try {
        console.log('Sending notification to residents: ', selectedResidentIds);
        console.log('Notification ID: ', notify.notificationId);
        
        
        await sendNotification({
          notificationId: notify.notificationId,
          residentIds: selectedResidentIds,
        }).unwrap();
        setSnackbar({
          open: true,
          message: 'Thông báo đã được gửi thành công!',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi gửi thông báo!',
          severity: 'error',
        });
      }
    }

    setResidentSelectionDialogOpen(false); 
  };

  const handleDelete = async () => {
    if (!current?.notificationId) return;

    try {
      await deleteNotify(current.notificationId).unwrap();
      setSnackbar({
        open: true,
        message: 'Xóa thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Hiện tại không thể xóa!',
        severity: 'error',
      });
    } finally {
      handleCloseDialog();
      setCurrent(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteNotify(id).unwrap()));
      setSnackbar({
        open: true,
        message: 'Xóa các thông báo đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các thông báo',
        severity: 'error',
      });
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
    }
  };

  const handleNotifySubmit = async (data: NewNotify) => {
    try {
      if (editingNotification) {
        await updateNotification({
          id: editingNotification.notificationId,
          notification: data,
        }).unwrap();
        setSnackbar({
          open: true,
          message: 'Cập nhật thông báo thành công',
          severity: 'success',
        });
      } else {
        await addNotification(data).unwrap();
        setSnackbar({
          open: true,
          message: 'Thêm thông báo thành công',
          severity: 'success',
        });
      }
      setFormDialogOpen(false);
      setEditingNotification(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title={`Xóa thông báo - ID: ${current?.notificationId}`}
        message="Bạn có chắc chắn muốn xóa không?"
      />
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều thông báo"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} thông báo được chọn?`}
      />
      <ResidentSelectionDialog
        open={residentSelectionDialogOpen}
        onClose={() => setResidentSelectionDialogOpen(false)}
        residents={residents}
        onSelect={handleSelectResidents}
      />
      <NotifyFormDialog
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingNotification(null);
        }}
        notification={editingNotification}
        onSubmit={handleNotifySubmit}
        title={editingNotification ? 'Cập nhật thông báo' : 'Thêm thông báo'}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h1">Danh sách thông báo</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setEditingNotification(null);
                setFormDialogOpen(true);
              }}
            >
              Thêm thông báo
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <NotifyDataGrid
            onSendNotification={(notify) => {
              setNotify(notify);
              setResidentSelectionDialogOpen(true);
            }}
            onEdit={(notify) => {
              setEditingNotification(notify);
              setFormDialogOpen(true);
            }}
            onDelete={(notificationId) => {
              setCurrent({ notificationId } as Notify);
              setOpenDialog(true);
            }}
            onBulkDelete={(ids) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default NotifyPage;
