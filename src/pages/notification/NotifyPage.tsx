import Grid from '@mui/material/Grid';
import { Alert, Button, Modal, Paper, Snackbar, Stack, Typography } from '@mui/material';
import NotifyDataGrid from './NotifyDataGrid';
import { useCallback, useState } from 'react';
import ResidentsDataGrid from 'pages/residents/ResidentsDataGrid';
import { ResidentViaApartment } from 'interface/Residents';
import { NewNotify, Notify } from 'interface/Utils';
import { useAddNotificationMutation, useDeleteNotificationMutation, useUpdateNotificationMutation } from 'api/serviceApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import NotifyFormDialog from './NotifyFormDialog';

const NotifyPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState<ResidentViaApartment[]>([]);
  const [notify, setNotify] = useState<Notify | null>(null);

  const handSendNoification = async () => {
    const tokens = selectedResidents
      .map((resident) => resident.fcmToken)
      .filter((token): token is string => token !== undefined);

    console.log(tokens);

    if (tokens.length === 0 || tokens.length === 1) {
      return;
    }

    // check notify not null
    if (!notify) {
      return;
    }

    console.log(selectedResidents);
    try {
      // const res = await sendNotifications({
      //   tokens: tokens,
      //   title: notify.notificationTitle,
      //   body: notify.notificationBody,
      // });
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const [current, setCurrent] = useState<Notify | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [deleteNotify] = useDeleteNotificationMutation();
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  // Handle single deletion
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

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      // Sequential deletion of all selected buildings
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

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notify | null>(null);

  const [addNotification] = useAddNotificationMutation();
  const [updateNotification] = useUpdateNotificationMutation();

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

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều thông báo"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} thông báo được chọn?`}
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
              setModalOpen(true);
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
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            borderRadius: 0,
          }}
        >
          <div className="flex flex-row space-x-10 items-center">
            <Typography variant="h3">Chọn người gửi</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handSendNoification();
              }}
            >
              Gửi
            </Button>
          </div>
          <ResidentsDataGrid
            onSelectionChange={(selectedResidents) => {
              setSelectedResidents(selectedResidents);
            }}
          />
        </Paper>
      </Modal>
    </>
  );
};

export default NotifyPage;
