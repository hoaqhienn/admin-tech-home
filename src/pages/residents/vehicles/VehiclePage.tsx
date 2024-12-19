import { Alert, Button, Grid, Snackbar, Typography } from '@mui/material';
import VehicleDataGrid from './VehicleDataGrid';
import VehicleDialog from './VehicleDialog';
import { Vehicle } from 'interface/Vehicle';
import { useCallback, useState } from 'react';
import { useDeleteVehicleMutation } from 'api/residentApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import VehiclePieChart from './VehiclePieChart';

const VehiclePage: React.FC = () => {
  const [current, setCurrent] = useState<Vehicle | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [deleteVehicle] = useDeleteVehicleMutation();

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);
  const handleCloseVehicleDialog = useCallback(() => {
    setOpenVehicleDialog(false);
    setCurrent(null);
  }, []);

  // Handle single deletion
  const handleDelete = async () => {
    if (!current?.vehicleId) return;

    try {
      await deleteVehicle(current.vehicleId).unwrap();
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
      await Promise.all(selectedIds.map((id) => deleteVehicle(id).unwrap()));
      setSnackbar({
        open: true,
        message: 'Xóa các phương tiện đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các phương tiện',
        severity: 'error',
      });
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setCurrent(vehicle);
    setOpenVehicleDialog(true);
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
        title={`Xóa phương tiện - ID: ${current?.vehicleId}`}
        message="Bạn có chắc chắn muốn xóa không?"
      />

      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều phương tiện"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} phương tiện được chọn?`}
      />

      <VehicleDialog
        open={openVehicleDialog}
        onClose={handleCloseVehicleDialog}
        vehicle={current}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h1">Danh sách phương tiện</Typography>
          <Button variant="contained" onClick={() => setOpenVehicleDialog(true)}>
            Thêm phương tiện
          </Button>
        </Grid>
        <Grid item xs={12}>
          <VehicleDataGrid
            onEdit={handleEdit}
            onDelete={(vehicleId) => {
              setCurrent({ vehicleId } as Vehicle);
              setOpenDialog(true);
            }}
            onBulkDelete={(ids) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <VehiclePieChart />
        </Grid>
      </Grid>
    </>
  );
};

export default VehiclePage;
