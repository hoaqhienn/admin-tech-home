import { useCallback, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Floor } from 'interface/Properties';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import FloorsDataGrid from './FloorsDataGrid';
import FloorResidentsChart from './FloorResidentsChart';
import ConfirmDialog from 'components/dialog/ConfirmDialog';

const Floors = () => {
  // Form states
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);

  // Delete dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedFloorIds, setSelectedFloorIds] = useState<number[]>([]);

  const handleDelete = useCallback((id: number) => {
    console.log('Deleting floor with id:', id);
  }, []);

  const handleBulkDelete = useCallback(() => {
    console.log('Deleting floors with ids:', selectedFloorIds);
  }, [selectedFloorIds]);

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const handleConfirmDelete = useCallback(async () => {
    if (currentFloor) {
      await handleDelete(currentFloor.floorId);
      setOpenDialog(false);
    }
  }, [currentFloor, handleDelete]);

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

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
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
      </Grid>
    </>
  );
};

export default Floors;
