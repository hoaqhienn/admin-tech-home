import Grid from '@mui/material/Grid';
import { Alert, Snackbar, Typography } from '@mui/material';
import ScrollToTop from 'components/fab/ScrollToTop';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import IconifyIcon from 'components/base/IconifyIcon';
import ApartmentsDataGrid from './ApartmentsDataGrid';
import { useCallback, useState } from 'react';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { Apartment } from 'interface/Properties';
import { useDeleteApartmentMutation } from 'api/propertyApi';
import ApartmentPieChart from './ApartmentPieChart';

const Apartments = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Add Apartment',
      onClick: () => {
        console.log('Add Apartment');
      },
    },
  ];

  const [deleteApartment] = useDeleteApartmentMutation();

  // Handle single building deletion
  const handleDeleteBuilding = async () => {
    if (!currentApartment?.apartmentId) return;

    try {
      await deleteApartment(currentApartment.apartmentId).unwrap();
      setSnackbar({
        open: true,
        message: 'Xóa căn hộ thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Căn hộ này đang được sử dụng',
        severity: 'error',
      });
    } finally {
      handleCloseDialog();
      setCurrentApartment(null);
    }
  };

  // Handle bulk building deletion
  const handleBulkDeleteBuildings = async () => {
    try {
      // Sequential deletion of all selected buildings
      await Promise.all(selectedIds.map((id) => deleteApartment(id).unwrap()));

      setSnackbar({
        open: true,
        message: 'Xóa các căn hộ đã chọn thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các căn hộ!',
        severity: 'error',
      });
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
    }
  };

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />
      {/* Single Delete Confirmation */}
      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteBuilding}
        title={`Xóa căn hộ - ID: ${currentApartment?.apartmentId}`}
        message="Bạn có chắc chắn muốn xóa căn hộ này không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDeleteBuildings}
        title="Xóa nhiều căn hộ"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} căn hộ được chọn?`}
      />
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
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách căn hộ</Typography>
        </Grid>
        <Grid item xs={12}>
          <ApartmentsDataGrid
            onEdit={() => {}}
            onDelete={(apartmentId) => {
              setCurrentApartment({ apartmentId } as Apartment);
              setOpenDialog(true);
            }}
            onBulkDelete={(apartmentIds) => {
              setSelectedIds(apartmentIds);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ApartmentPieChart />
        </Grid>
      </Grid>
    </>
  );
};

export default Apartments;
