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


const Buildings = () => {
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  // add ref
  const addRef = useRef<HTMLDivElement>(null);

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Building',
      onClick: () => {
        // handleClickOpen();
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
        onConfirm={() => {}}
        title={`Xóa tòa nhà - ID: ${currentBuilding?.buildingId}`}
        message="Bạn có chắc chắn muốn xóa tòa nhà này không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={() => {}}
        title="Xóa nhiều tòa nhà"
        message={`Bạn có chắc chắn muốn xóa ${selectedBuildingIds.length} tòa nhà được chọn?`}
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách tòa nhà</Typography>
        </Grid>
        <Grid item xs={12}>
          <BuildingsDataGrid
            onEdit={() => {}}
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
