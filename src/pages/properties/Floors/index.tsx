import { useCallback, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Floor } from 'interface/Properties';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { FormDialog, TextFieldProps } from 'components/input/FormDialog';
import FloorsDataGrid from './FloorsDataGrid';
import ConfirmationDialog from 'components/dialog/ConfirmationDialog';
import FloorResidentsChart from './FloorResidentsChart';

const initialFloorState = { floorNumber: '', buildingId: -1 };

const Floors = () => {
  // Form states
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);
  const [newFloor, setNewFloor] = useState(initialFloorState);

  // Delete dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedFloorIds, setSelectedFloorIds] = useState<number[]>([]);

  const handleClickOpen = useCallback((floor?: Floor) => {
    if (floor) {
      setNewFloor({
        floorNumber: floor.floorNumber,
        buildingId: floor.buildingId,
      });
      setCurrentFloor(floor);
      setIsEditing(true);
    } else {
      setNewFloor(initialFloorState);
      setIsEditing(false);
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setCurrentFloor(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFloor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('newFloor:', newFloor);
  }, [newFloor]);

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
      onClick: () => handleClickOpen(),
    },
  ];

  const inputs: TextFieldProps[] = [
    {
      name: 'buildingId',
      label: 'Building ID',
      value: newFloor.buildingId.toString(),
    },
    {
      name: 'floorNumber',
      label: 'Floor Number',
      value: newFloor.floorNumber,
    },
  ];

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />

      {/* Single Delete Confirmation */}
      <ConfirmationDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Floor"
        message="Are you sure you want to delete this floor?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmationDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Floors"
        message={`Are you sure you want to delete ${selectedFloorIds.length} selected floors?`}
      />

      <FormDialog
        open={open}
        isEditing={isEditing}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        textInput={inputs}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách tầng</Typography>
        </Grid>
        <Grid item xs={12}>
          <FloorsDataGrid
            onEdit={handleClickOpen}
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
