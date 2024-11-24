import { useEffect, useState, useCallback } from 'react';
import { Building } from 'interface/Properties';
import ConfirmationDialog from 'components/dialog/ConfirmationDialog';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Grid, Typography } from '@mui/material';
import { useBuildings } from 'hooks/useBuilding';
import { BuildingCard } from './BuildingCard';
import IconifyIcon from 'components/base/IconifyIcon';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { TextFieldProps, FormDialog } from 'components/input/FormDialog';

const initialBuildingState = { buildingName: '', buildingAddress: '' };

const Buildings = () => {
  const { buildings, fetchBuildings, addBuilding, updateBuilding, deleteBuilding } = useBuildings();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [newBuilding, setNewBuilding] = useState(initialBuildingState);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBuildings();
  }, []);

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
      fetchBuildings();
    } else {
      const createdAt = new Date().toISOString();
      const newBuildingData: Omit<Building, 'buildingId'> = {
        ...newBuilding,
        createdAt,
        updatedAt,
      };
      try {
        addBuilding(newBuildingData);
      } catch (error) {
        console.error('Error adding new building:', error);
      }
    }

    setNewBuilding(initialBuildingState);
    handleClose();
  }, [isEditing, currentBuilding, newBuilding, handleClose]);

  const handleDelete = useCallback(async (buildingId: number) => {
    await deleteBuilding(buildingId);
    fetchBuildings();
  }, []);

  const handleOpenDialog = useCallback(() => setOpenDialog(true), []);
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

  const handleConfirmDelete = useCallback(() => {
    if (currentBuilding) {
      handleDelete(currentBuilding.buildingId);
      setOpenDialog(false);
    }
  }, [currentBuilding, handleDelete]);

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Building',
      onClick: () => {
        handleClickOpen();
      },
    },
    { icon: <IconifyIcon icon="ic:menu" />, title: 'Floor', onClick: () => {} },
    {
      icon: <IconifyIcon icon="ic:menu" />,
      title: 'Apartment',
      onClick: () => {},
    },
  ];

  const inputs: TextFieldProps[] = [
    {
      name: 'buildingName',
      label: 'Building Name',
      value: newBuilding.buildingName,
    },
    {
      name: 'buildingAddress',
      label: 'Building Address',
      value: newBuilding.buildingAddress,
    },
  ];

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />
      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Building"
        message="Are you sure you want to delete this building?"
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
          <Typography variant="h2">Buildings</Typography>
        </Grid>

        {buildings.map((building) => (
          <Grid item xs={6} md={4} key={building.buildingId}>
            <BuildingCard
              building={building}
              handleToggle={handleClickOpen}
              handleEdit={handleClickOpen}
              handleDelete={() => {
                setCurrentBuilding(building);
                handleOpenDialog();
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Buildings;
