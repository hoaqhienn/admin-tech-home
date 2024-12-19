import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Typography,
  Switch,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
} from '@mui/material';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import ServiceDataGrid from './ExternalServiceDataGrid';
import { OutsourcingService, OutsourcingServiceDetail } from 'interface/Ad';
import {
  useDeleteOutsourcingServiceMutation,
  useGetOutsourcingServiceByIdQuery,
  useUpdateOutsourcingServiceMutation,
} from 'api/adApi';

const DEFAULT_SERVICE: OutsourcingServiceDetail = {
  outsourcingServiceId: null,
  outsourcingServiceName: '',
  outsourcingServiceDescription: '',
  outsourcingServiceImage: '',
  outsourcingServiceStatus: 'INACTIVE',
  outsourceServicePrice: null,
  outsourceServiceLocation: '',
  outsourcingServiceType: '',
  createdAt: null,
  updatedAt: null,
  fullname: '',
  avatar: '',
  email: '',
  phonenumber: '',
};

const SnackbarMessages = {
  ADD_SUCCESS: 'Thêm dịch vụ thành công!',
  UPDATE_SUCCESS: 'Cập nhật dịch vụ thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  DELETE_ERROR: 'Hiện tại không thể xóa!',
  BULK_DELETE_SUCCESS: 'Xóa các quảng cáo đã chọn thành công',
  BULK_DELETE_ERROR: 'Có lỗi xảy ra khi xóa các quảng cáo',
  VALIDATION_ERROR_NAME: 'Vui lòng nhập tên dịch vụ',
  VALIDATION_ERROR_PRICE: 'Vui lòng nhập giá dịch vụ hợp lệ',
};

const ExternalServicePage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<OutsourcingService | null>(null);
  const [newService, setNewService] = useState<OutsourcingServiceDetail>(DEFAULT_SERVICE);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [deleteService] = useDeleteOutsourcingServiceMutation();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === 'outsourcingServiceStatus' ? (checked ? 'ACTIVE' : 'INACTIVE') : value,
    }));
  }, []);

  const handleInputSelect = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const { data } = useGetOutsourcingServiceByIdQuery(current?.outsourcingServiceId || 0, {
    skip: !open || current?.outsourcingServiceId === null,
  });

  const handleClickOpen = (service?: OutsourcingService) => {
    if (service) {
      setCurrent(service);
      setIsEditing(true);
    } else {
      setNewService(DEFAULT_SERVICE);
      setIsEditing(false);
    }
    setOpen(true);
  };

  useEffect(() => {
    if (data && current) {
      setNewService({
        outsourcingServiceId: data.outsourcingServiceId || null,
        outsourcingServiceName: data.outsourcingServiceName,
        outsourcingServiceDescription: data.outsourcingServiceDescription,
        outsourcingServiceImage: data.outsourcingServiceImage,
        outsourcingServiceStatus: data.outsourcingServiceStatus,
        outsourceServicePrice: data.outsourceServicePrice,
        outsourceServiceLocation: data.outsourceServiceLocation,
        outsourcingServiceType: data.outsourcingServiceType,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        fullname: data.fullname,
        avatar: data.avatar,
        email: data.email,
        phonenumber: data.phonenumber,
      });
    }
  }, [data, current]);

  const handleClose = () => {
    setOpen(false);
    setCurrent(null);
  };

  const [updateExternalService] = useUpdateOutsourcingServiceMutation();

  const handleSubmit = async () => {
    if (!newService.outsourcingServiceName.trim()) {
      handleSnackbar(SnackbarMessages.VALIDATION_ERROR_NAME, 'error');
      return;
    }

    if (!newService.outsourceServicePrice || Number(newService.outsourceServicePrice) <= 0) {
      handleSnackbar(SnackbarMessages.VALIDATION_ERROR_PRICE, 'error');
      return;
    }

    try {
      const serviceData = {
        outsourcingServiceId: newService.outsourcingServiceId,
        outsourcingServiceName: newService.outsourcingServiceName,
        outsourcingServiceDescription: newService.outsourcingServiceDescription,
        outsourceServicePrice: Number(newService.outsourceServicePrice),
        outsourceServiceLocation: newService.outsourceServiceLocation,
        outsourcingServiceType: newService.outsourcingServiceType,
        outsourcingServiceStatus: newService.outsourcingServiceStatus,
      };

      if (isEditing && current?.outsourcingServiceId) {
        await updateExternalService(serviceData).unwrap();
        handleSnackbar(SnackbarMessages.UPDATE_SUCCESS, 'success');
      } else {
        // await addService(serviceData).unwrap();
        handleSnackbar(SnackbarMessages.ADD_SUCCESS, 'success');
      }
    } catch {
      handleSnackbar('Có lỗi xảy ra!', 'error');
    } finally {
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (!current?.outsourcingServiceId) return;

    try {
      await deleteService(current.outsourcingServiceId).unwrap();
      handleSnackbar(SnackbarMessages.DELETE_SUCCESS, 'success');
    } catch {
      handleSnackbar(SnackbarMessages.DELETE_ERROR, 'error');
    } finally {
      setOpenDialog(false);
      setCurrent(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteService(id).unwrap()));
      handleSnackbar(SnackbarMessages.BULK_DELETE_SUCCESS, 'success');
    } catch {
      handleSnackbar(SnackbarMessages.BULK_DELETE_ERROR, 'error');
    } finally {
      setOpenBulkDeleteDialog(false);
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
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        title={`Xóa cơ sở tiện ích - ID: ${current?.outsourcingServiceId}`}
        message="Bạn có chắc chắn muốn xóa không?"
      />
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={() => setOpenBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều cơ sở tiện ích"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} cơ sở tiện ích được chọn?`}
      />
      <Grid container spacing={2.5}>
        <Grid item xs={10}>
          <Typography variant="h1">Danh sách dịch vụ</Typography>
        </Grid>
        <Grid item xs={12}>
          <ServiceDataGrid
            onEdit={handleClickOpen}
            onDelete={(id) => {
              setCurrent({ outsourcingServiceId: id } as OutsourcingService);
              setOpenDialog(true);
            }}
            onBulkDelete={(ids) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
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
          <DialogTitle>{isEditing ? 'Chi tiết dịch vụ' : 'Add New Service'}</DialogTitle>
          <DialogContent>
            {/* 
            outsourcingServiceName**  outsourcingServiceDescription** outsourceServicePrice** outsourceServiceLocation**  outsourcingServiceType** 
            outsourcingServiceImage outsourcingServiceStatus  updatedAt fullname  avatar  email phonenumber
            */}
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Paper className="border h-full">
                  <Typography variant="subtitle1">Thông tin nhà cung cấp</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px',
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
                  <Typography variant="subtitle1">Thông tin chi tiết dịch vụ</Typography>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Loại dịch vụ</InputLabel>
                    <Select
                      label="Loại dịch vụ"
                      name="outsourcingServiceType"
                      value={newService.outsourcingServiceType}
                      onChange={handleInputSelect}
                    >
                      <MenuItem value="FOOD">FOOD</MenuItem>
                      <MenuItem value="DRINKS">DRINKS</MenuItem>
                      <MenuItem value="OTHER">OTHER</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Tên dịch vụ"
                    name="outsourcingServiceName"
                    fullWidth
                    variant="outlined"
                    value={newService.outsourcingServiceName}
                    onChange={handleInputChange}
                  />

                  <TextField
                    margin="dense"
                    label="Giá dịch vụ"
                    name="outsourceServicePrice"
                    fullWidth
                    variant="outlined"
                    value={newService.outsourceServicePrice}
                    onChange={handleInputChange}
                    type="number"
                  />
                  <TextField
                    margin="dense"
                    label="Địa chỉ"
                    name="outsourceServiceLocation"
                    fullWidth
                    variant="outlined"
                    value={newService.outsourceServiceLocation}
                    onChange={handleInputChange}
                  />
                  <TextField
                    margin="dense"
                    label="Mô tả"
                    name="outsourcingServiceDescription"
                    fullWidth
                    variant="outlined"
                    value={newService.outsourcingServiceDescription}
                    onChange={handleInputChange}
                    multiline={true}
                    rows={4}
                  />
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className="border h-full">
                  <Typography variant="subtitle1">Ảnh dịch vụ</Typography>

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
                      src={newService.outsourcingServiceImage}
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
                      checked={newService.outsourcingServiceStatus === 'ACTIVE'}
                      onChange={handleInputChange}
                      name="outsourcingServiceStatus"
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    {newService.outsourcingServiceStatus === 'ACTIVE'
                      ? 'Hoạt động'
                      : 'Ngưng hoạt động'}
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
      </Grid>
    </>
  );
};

export default ExternalServicePage;
