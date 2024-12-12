import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useState } from 'react';

import { Service } from 'interface/Service';
import ServiceDataGrid from './ServiceDataGrid';
import { Alert, Snackbar, Typography } from '@mui/material';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import {
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from 'api/serviceApi';

const Services = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [addService] = useAddServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const [newService, setNewService] = useState({
    serviceName: '',
    servicePrice: '',
    createdAt: '',
    updatedAt: '',
    buildingId: 1,
  });

  const handleClickOpen = (service?: Service) => {
    if (service) {
      setNewService({
        serviceName: service.serviceName,
        servicePrice: service.servicePrice.toString(),
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        buildingId: service.buildingId || 1,
      });
      setCurrent(service);
      setIsEditing(true);
    } else {
      setNewService({
        serviceName: '',
        servicePrice: '',
        createdAt: '',
        updatedAt: '',
        buildingId: 1,
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!newService.serviceName.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập tên dịch vụ',
        severity: 'error',
      });
      return;
    }

    if (!newService.servicePrice || Number(newService.servicePrice) <= 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập giá dịch vụ hợp lệ',
        severity: 'error',
      });
      return;
    }
    try {
      const serviceData = {
        serviceName: newService.serviceName,
        servicePrice: Number(newService.servicePrice),
        buildingId: 1, // You'll need to provide the correct buildingId
      };

      if (isEditing && current?.serviceId) {
        await updateService({
          id: current.serviceId,
          service: {
            ...current,
            ...serviceData,
          },
        }).unwrap();
        setSnackbar({
          open: true,
          message: 'Cập nhật dịch vụ thành công!',
          severity: 'success',
        });
      } else {
        await addService(serviceData).unwrap();
        setSnackbar({
          open: true,
          message: 'Thêm dịch vụ thành công!',
          severity: 'success',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra!',
        severity: 'error',
      });
    }
    handleClose();
  };

  // Update the ServiceDataGrid component usage to handle edit
  const handleEdit = (service: Service) => {
    handleClickOpen(service);
  };

  const [current, setCurrent] = useState<Service | null>(null);
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

  // Handle single deletion
  const handleDelete = async () => {
    if (!current?.serviceId) return;

    try {
      await deleteService(current.serviceId).unwrap();
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
      await Promise.all(selectedIds.map((id) => deleteService(id).unwrap()));

      setSnackbar({
        open: true,
        message: 'Xóa các tòa nhà đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các tòa nhà',
        severity: 'error',
      });
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
        title={`Xóa cơ sở tiện ích - ID: ${current?.serviceId}`}
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
          <Typography variant="h1">Danh sách dịch vụ</Typography>
        </Grid>
        <Grid item xs={12}>
          <ServiceDataGrid
            onEdit={handleEdit}
            onDelete={(serviceId) => {
              setCurrent({ serviceId } as Service);
              setOpenDialog(true);
            }}
            onBulkDelete={(ids) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>

        <Button
          type="submit"
          variant="contained"
          size="medium"
          onClick={() => handleClickOpen()}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          Add Service
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Update Service' : 'Add New Service'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Service Name"
              name="serviceName"
              fullWidth
              variant="outlined"
              value={newService.serviceName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Service Price"
              name="servicePrice"
              fullWidth
              variant="outlined"
              value={newService.servicePrice}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Building ID"
              name="buildingId"
              fullWidth
              variant="outlined"
              value={newService.buildingId}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default Services;
