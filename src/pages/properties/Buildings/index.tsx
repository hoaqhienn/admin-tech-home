import { useState, useCallback, useRef } from 'react';
import { Building } from 'interface/Properties';
import ConfirmationDialog from 'components/dialog/ConfirmationDialog';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import { useBuildings } from 'hooks/properties/useBuilding';
import IconifyIcon from 'components/base/IconifyIcon';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { TextFieldProps, FormDialog } from 'components/input/FormDialog';
import BuildingsDataGrid from './BuildingsDataGrid';
import BuildingResidentsChart from './BuildingResidentsChart';
import AddBuilding from './AddBuilding';

const initialBuildingState = { buildingName: '', buildingAddress: '' };

const Buildings = () => {
  const { addBuilding, updateBuilding, deleteBuilding } = useBuildings();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>([]);
  const [newBuilding, setNewBuilding] = useState(initialBuildingState);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  // add ref
  const addRef = useRef<HTMLDivElement>(null);

  const handleClickOpen = useCallback((building?: Building) => {
    if (building) {
      setNewBuilding({
        buildingName: building.buildingName,
        buildingAddress: building.buildingAddress,
      });
      setCurrentBuilding(building);
      setIsEditing(true);
    } else {
      setNewBuilding(initialBuildingState);
      setIsEditing(false);
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setCurrentBuilding(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBuilding((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const updatedAt = new Date().toISOString();

    if (isEditing && currentBuilding) {
      const updatedBuilding: Building = {
        ...currentBuilding,
        ...newBuilding,
        updatedAt,
      };
      await updateBuilding(updatedBuilding);
    } else {
      const createdAt = new Date().toISOString();
      const newBuildingData: Omit<Building, 'buildingId'> = {
        ...newBuilding,
        createdAt,
        updatedAt,
        totalFloors: 0,
        totalApartments: 0,
        totalResidents: 0,
      };
      try {
        await addBuilding(newBuildingData);
      } catch (error) {
        console.error('Error adding new building:', error);
      }
    }

    setNewBuilding(initialBuildingState);
    handleClose();
  }, [
    isEditing,
    currentBuilding,
    newBuilding,
    handleClose,
    addBuilding,
    updateBuilding,
  ]);

  const handleDelete = useCallback(
    async (buildingId: number) => {
      await deleteBuilding(buildingId);
    },
    [deleteBuilding],
  );

  const handleBulkDelete = useCallback(async () => {
    try {
      await Promise.all(selectedBuildingIds.map((id) => deleteBuilding(id)));
      setOpenBulkDeleteDialog(false);
      setSelectedBuildingIds([]);
    } catch (error) {
      console.error('Error deleting buildings:', error);
    }
  }, [selectedBuildingIds, deleteBuilding]);

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

  const handleConfirmDelete = useCallback(async () => {
    if (currentBuilding) {
      await handleDelete(currentBuilding.buildingId);
      setOpenDialog(false);
    }
  }, [currentBuilding, handleDelete]);

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

  const inputs: (TextFieldProps & { key: string })[] = [
    {
      key: 'buildingName',
      name: 'buildingName',
      label: 'Building Name',
      value: newBuilding.buildingName,
    },
    {
      key: 'buildingAddress',
      name: 'buildingAddress',
      label: 'Building Address',
      value: newBuilding.buildingAddress,
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
      <ConfirmationDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title={`Xóa tòa nhà - ID: ${currentBuilding?.buildingId}`}
        message="Bạn có chắc chắn muốn xóa tòa nhà này không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmationDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều tòa nhà"
        message={`Bạn có chắc chắn muốn xóa ${selectedBuildingIds.length} tòa nhà được chọn?`}
      />

      <FormDialog
        open={open}
        isEditing={isEditing}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        textInput={inputs}
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách tòa Nhà</Typography>
        </Grid>
        <Grid item xs={12}>
          <BuildingsDataGrid
            onEdit={handleClickOpen}
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
