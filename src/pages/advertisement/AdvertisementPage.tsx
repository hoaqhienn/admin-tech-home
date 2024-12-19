import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useEffect, useState } from 'react';

import ServiceDataGrid from './AdvertisementDataGrid';
import { Alert, Box, Paper, Snackbar, Switch, Typography } from '@mui/material';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { Ad, AdDetail } from 'interface/Ad';
import {
  useDeleteAdvertisementMutation,
  useGetAdvertisementByIdQuery,
  useUpdateAdvertisementMutation,
} from 'api/adApi';

const DEFAULT_SERVICE: AdDetail = {
  advertisementId: null,
  advertisementName: '',
  advertisementContent: '',
  advertisementImage: '',
  advertisementStatus: 'INACTIVE',
  adverLocation: '',
  createdAt: null,
  updatedAt: null,
  fullname: '',
  avatar: '',
  email: '',
  phonenumber: '',
};

const SnackbarMessages = {
  ADD_SUCCESS: 'Thêm quảng cáo thành công!',
  UPDATE_SUCCESS: 'Cập nhật quảng cáo thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  DELETE_ERROR: 'Hiện tại không thể xóa!',
  BULK_DELETE_SUCCESS: 'Xóa các quảng cáo đã chọn thành công',
  BULK_DELETE_ERROR: 'Có lỗi xảy ra khi xóa các quảng cáo',
  VALIDATION_ERROR_NAME: 'Vui lòng nhập tên quảng cáo',
};

const AdvertisementPage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Ad | null>(null);
  const [newService, setNewService] = useState<AdDetail>(DEFAULT_SERVICE);

  const handleClickOpen = (service?: Ad) => {
    if (service) {
      setCurrent(service);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrent(null);
  };

  const { data } = useGetAdvertisementByIdQuery(current?.advertisementId || 0, {
    skip: !open || current?.advertisementId === null,
  });

  useEffect(() => {
    if (data && current) {
      setNewService({
        advertisementId: data.advertisementId || null,
        advertisementName: data.advertisementName,
        advertisementContent: data.advertisementContent,
        advertisementImage: data.advertisementImage,
        adverLocation: data.adverLocation,
        advertisementStatus: data.advertisementStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        fullname: data.fullname,
        avatar: data.avatar,
        email: data.email,
        phonenumber: data.phonenumber,
      });
    }
    console.log('detail :: ', newService);
  }, [data, current]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === 'advertisementStatus' ? (checked ? 'ACTIVE' : 'INACTIVE') : value,
    }));
  }, []);

  const handleSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const [updateAdvertisement] = useUpdateAdvertisementMutation();

  const handleSubmit = async () => {
    // Validation
    if (!newService.advertisementName.trim()) {
      handleSnackbar(SnackbarMessages.VALIDATION_ERROR_NAME, 'error');
      return;
    }

    try {
      const serviceData = {
        advertisementId: newService.advertisementId,
        advertisementName: newService.advertisementName,
        advertisementContent: newService.advertisementContent,
        adverLocation: newService.adverLocation,
        advertisementStatus: newService.advertisementStatus,
      };

      if (isEditing && current?.advertisementId) {
        // call mutation function
        await updateAdvertisement(serviceData).unwrap();
        handleSnackbar(SnackbarMessages.UPDATE_SUCCESS, 'success');
      } else {
        handleSnackbar(SnackbarMessages.ADD_SUCCESS, 'success');
      }
    } catch (error) {
      handleSnackbar('Có lỗi xảy ra!', 'error');
    } finally {
      handleClose();
    }
  };

  // Update the ServiceDataGrid component usage to handle edit
  const handleEdit = (service: Ad) => {
    handleClickOpen(service);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const [deleteAdvertisement] = useDeleteAdvertisementMutation();

  // Handle single deletion
  const handleDelete = async () => {
    if (!current?.advertisementId) return;

    try {
      // call mutation function
      await deleteAdvertisement(current.advertisementId).unwrap();
      handleSnackbar(SnackbarMessages.DELETE_SUCCESS, 'success');
    } catch (error) {
      handleSnackbar(SnackbarMessages.DELETE_ERROR, 'error');
    } finally {
      handleCloseDialog();
      setCurrent(null);
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      // Sequential deletion of all selected buildings
      await Promise.all(selectedIds.map((id) => deleteAdvertisement(id).unwrap()));
      handleSnackbar(SnackbarMessages.BULK_DELETE_SUCCESS, 'success');
    } catch (error) {
      handleSnackbar(SnackbarMessages.BULK_DELETE_ERROR, 'error');
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
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
        title={`Xóa cơ sở tiện ích - ID: ${current?.advertisementId}`}
        message="Bạn có chắc chắn muốn xóa không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều cơ sở tiện ích"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} cơ sở tiện ích được chọn?`}
      />
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách quảng cáo</Typography>
        </Grid>
        <Grid item xs={12}>
          <ServiceDataGrid
            onEdit={handleEdit}
            onDelete={(advertisementId) => {
              setCurrent({ advertisementId } as Ad);
              setOpenDialog(true);
            }}
            onBulkDelete={(ids) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '80%',
            maxHeight: '80%',
          },
        }}
      >
        <DialogTitle>{isEditing ? 'Chi tiết quảng cáo' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Paper className="border">
                <Typography variant="subtitle1">Thông tin nhà cung cấp</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={newService.avatar}
                    alt="Provider"
                    style={{
                      maxHeight: '50%',
                      maxWidth: '50%',
                      objectFit: 'cover',
                      borderRadius: '9999px',
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6urASGNbB4GsLxivJxSX9Z4If9PZuhXhmnA&s';
                    }}
                  />
                </Box>

                <TextField
                  margin="dense"
                  label="Họ và tên"
                  name="fullname"
                  fullWidth
                  variant="outlined"
                  value={newService.fullname}
                  onChange={handleInputChange}
                  disabled={true}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  name="email"
                  fullWidth
                  variant="outlined"
                  value={newService.email}
                  onChange={handleInputChange}
                  disabled={true}
                />
                <TextField
                  margin="dense"
                  label="Số điện thoại"
                  name="phonenumber"
                  fullWidth
                  variant="outlined"
                  value={newService.phonenumber}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className="border h-full">
                <Typography variant="subtitle1">Thông tin chi tiết quảng cáo</Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Tên dịch vụ"
                  name="advertisementName"
                  fullWidth
                  variant="outlined"
                  value={newService.advertisementName}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  label="Địa chỉ"
                  name="adverLocation"
                  fullWidth
                  variant="outlined"
                  value={newService.adverLocation}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  label="Nội dung"
                  name="advertisementContent"
                  fullWidth
                  variant="outlined"
                  value={newService.advertisementContent}
                  onChange={handleInputChange}
                  multiline={true}
                  rows={4}
                />
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className="border h-full">
                <Typography variant="subtitle1">Ảnh quảng cáo</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10px',
                    marginBottom: '5px',
                  }}
                >
                  <img
                    src={newService.advertisementImage}
                    alt="Service"
                    style={{
                      width: '70%',
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: '10px',
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6urASGNbB4GsLxivJxSX9Z4If9PZuhXhmnA&s';
                    }}
                  />
                </Box>
                <div className="flex flex-col justify-center items-center">
                  <Switch
                    checked={newService.advertisementStatus === 'ACTIVE'}
                    onChange={handleInputChange}
                    name="advertisementStatus"
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  {newService.advertisementStatus === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdvertisementPage;
