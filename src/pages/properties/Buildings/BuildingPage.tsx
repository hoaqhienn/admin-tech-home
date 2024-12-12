import { useState, useCallback, useRef } from 'react';
import { Building } from 'interface/Properties';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import BuildingsDataGrid from './BuildingsDataGrid';
import BuildingResidentsChart from './BuildingResidentsChart';
import AddBuilding from './AddBuilding';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { useDeleteBuildingMutation, useUpdateBuildingMutation } from 'api/propertyApi';
import EditBuildingDialog from './EditBuildingDialog';

const Buildings = () => {
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const addRef = useRef<HTMLDivElement>(null);

  // Initialize delete mutation
  const [deleteBuilding] = useDeleteBuildingMutation();
  const [updateBuilding] = useUpdateBuildingMutation();

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);
  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setCurrentBuilding(null);
  }, []);
  // Handle single building deletion
  const handleDeleteBuilding = async () => {
    if (!currentBuilding?.buildingId) return;

    try {
      await deleteBuilding(currentBuilding.buildingId).unwrap();
      setSnackbar({
        open: true,
        message: 'Xóa tòa nhà thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Tòa nhà này đang được sử dụng',
        severity: 'error',
      });
    } finally {
      handleCloseDialog();
      setCurrentBuilding(null);
    }
  };

  const handleUpdateBuilding = async (buildingId: number, newName: string) => {
    if (!currentBuilding) return;

    try {
      // Create updated building object maintaining all existing properties
      const updatedBuilding: Building = {
        ...currentBuilding,
        buildingId,
        buildingName: newName,
      };

      // Call the update mutation with the complete building object
      await updateBuilding(updatedBuilding).unwrap();

      setSnackbar({
        open: true,
        message: 'Cập nhật tòa nhà thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật tòa nhà',
        severity: 'error',
      });
      throw new Error('Failed to update building');
    }
  };

  // Handle bulk building deletion
  const handleBulkDeleteBuildings = async () => {
    try {
      // Sequential deletion of all selected buildings
      await Promise.all(selectedBuildingIds.map((id) => deleteBuilding(id).unwrap()));

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
      setSelectedBuildingIds([]);
    }
  };

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Building',
      onClick: () => {
        addRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

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
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteBuilding}
        title={`Xóa tòa nhà - ID: ${currentBuilding?.buildingId}`}
        message="Bạn có chắc chắn muốn xóa tòa nhà này không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDeleteBuildings}
        title="Xóa nhiều tòa nhà"
        message={`Bạn có chắc chắn muốn xóa ${selectedBuildingIds.length} tòa nhà được chọn?`}
      />
      <EditBuildingDialog
        building={currentBuilding}
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateBuilding}
      />
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách tòa nhà</Typography>
        </Grid>
        <Grid item xs={12}>
          <BuildingsDataGrid
            onEdit={(building) => {
              setCurrentBuilding(building);
              setIsEditDialogOpen(true);
            }}
            onDelete={(buildingId) => {
              setCurrentBuilding({ buildingId } as Building);
              setOpenDialog(true);
            }}
            onBulkDelete={(buildingIds) => {
              setSelectedBuildingIds(buildingIds);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <BuildingResidentsChart />
        </Grid>
        <Grid item xs={12} ref={addRef}>
          <AddBuilding setSnackbar={setSnackbar} />
        </Grid>
      </Grid>
    </>
  );
};

export default Buildings;
