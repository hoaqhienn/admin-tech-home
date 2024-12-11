import { useCallback, useState } from 'react';
import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Floor } from 'interface/Properties';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import FloorsDataGrid from './FloorsDataGrid';
import FloorResidentsChart from './FloorResidentsChart';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { useDeleteFloorMutation } from 'api/propertyApi';
import AddFloor from './AddFloor';

const Floors = () => {
  // Form states
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);

  // Delete dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedFloorIds, setSelectedFloorIds] = useState<number[]>([]);
  const [deleteFloor] = useDeleteFloorMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Handle single building deletion
  const handleDelete = async () => {
    if (!currentFloor?.floorId) return;

    try {
      await deleteFloor(currentFloor.floorId).unwrap();
      setSnackbar({
        open: true,
        message: 'Xóa tòa nhà thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa tòa nhà',
        severity: 'error',
      });
    } finally {
      handleCloseDialog();
      setCurrentFloor(null);
    }
  };

  // Handle bulk building deletion
  const handleBulkDelete = async () => {
    try {
      // Sequential deletion of all selected buildings
      await Promise.all(selectedFloorIds.map((id) => deleteFloor(id).unwrap()));

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
      setSelectedFloorIds([]);
    }
  };

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:round-add" />,
      title: 'Add floor',
      onClick: () => {},
    },
  ];

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />
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
      {/* Single Delete Confirmation */}
      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title="Delete Floor"
        message="Are you sure you want to delete this floor?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Floors"
        message={`Are you sure you want to delete ${selectedFloorIds.length} selected floors?`}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách tầng</Typography>
        </Grid>
        <Grid item xs={12}>
          <FloorsDataGrid
            onEdit={() => {}}
            onDelete={(floorId) => {
              setCurrentFloor({ floorId } as Floor);
              setOpenDialog(true);
            }}
            onBulkDelete={(floorIds) => {
              setSelectedFloorIds(floorIds);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FloorResidentsChart />
        </Grid>
        <Grid item xs={12}>
          <AddFloor setSnackbar={setSnackbar} />
        </Grid>
      </Grid>
    </>
  );
};

export default Floors;
