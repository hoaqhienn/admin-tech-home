import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ScrollToTop from 'components/fab/ScrollToTop';
import { FloorCard } from './FloorCard';
import { Floor } from 'interface/Properties';
import { FloorFilter } from './FloorFilter';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { FormDialog, TextFieldProps } from 'components/input/FormDialog';
import { useBuildings } from 'hooks/useBuilding';
import { useFloors } from 'hooks/useFloor';

interface FloorFormData {
  floorNumber: string;
  buildingId: string;
}

const INITIAL_FORM_DATA: FloorFormData = {
  floorNumber: '',
  buildingId: '',
};

const Floors = () => {
  // Main state
  const { fetchBuildings } = useBuildings();
  const { floors, AddFloor, UpdateFloor, RemoveFloor, fetchFloors } = useFloors();

  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [formData, setFormData] = useState<FloorFormData>(INITIAL_FORM_DATA);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    isEditing: false,
    isSubmitting: false,
    currentFloor: null as Floor | null,
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    floorToDelete: null as number | null,
    isSubmitting: false,
  });

  useEffect(() => {
    setIsLoading(true);
    fetchFloors();
    fetchBuildings();
    setIsLoading(false);
  }, []);

  // Form handlers
  const handleFormOpen = (floor?: Floor) => {
    if (floor) {
      setFormData({
        floorNumber: floor.floorNumber,
        buildingId: floor.buildingId.toString(),
      });
      setDialogState({
        isOpen: true,
        isEditing: true,
        isSubmitting: false,
        currentFloor: floor,
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
      setDialogState({
        isOpen: true,
        isEditing: false,
        isSubmitting: false,
        currentFloor: null,
      });
    }
  };

  const handleFormClose = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    setFormData(INITIAL_FORM_DATA);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handlers
  const handleSubmit = async () => {
    try {
      setDialogState((prev) => ({ ...prev, isSubmitting: true }));
      const updatedAt = new Date().toISOString();

      if (dialogState.isEditing && dialogState.currentFloor) {
        const updatedFloor: Floor = {
          ...dialogState.currentFloor,
          floorNumber: formData.floorNumber,
          buildingId: parseInt(formData.buildingId),
          updatedAt,
        };
        await UpdateFloor(updatedFloor);
      } else {
        const newFloorData = {
          floorNumber: formData.floorNumber,
          buildingId: parseInt(formData.buildingId),
          createdAt: new Date().toISOString(),
          updatedAt,
        };
        await AddFloor(newFloorData);
      }

      await fetchFloors();
      handleFormClose();
    } catch (error) {
      console.error('Error submitting floor:', error);
      // Here you might want to add error handling UI
    } finally {
      setDialogState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Delete handlers
  const handleDeleteConfirm = (floor: Floor) => {
    setDeleteDialog({
      isOpen: true,
      floorToDelete: floor.floorId,
      isSubmitting: false,
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.floorToDelete) return;

    try {
      setDeleteDialog((prev) => ({ ...prev, isSubmitting: true }));
      await RemoveFloor(deleteDialog.floorToDelete);
      await fetchFloors();
    } catch (error) {
      console.error('Error deleting floor:', error);
      // Here you might want to add error handling UI
    } finally {
      setDeleteDialog({
        isOpen: false,
        floorToDelete: null,
        isSubmitting: false,
      });
    }
  };

  const renderFloorCards = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} md={4} key={`skeleton-${index}`}>
          <FloorCard isLoading />
        </Grid>
      ));
    }

    const filteredFloors =
      selectedBuildingIds.length > 0
        ? floors.filter((floor) => selectedBuildingIds.includes(floor.buildingId))
        : floors;

    if (!filteredFloors.length) {
      return (
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography>No floors found</Typography>
          </Box>
        </Grid>
      );
    }

    return filteredFloors.map((floor) => (
      <Grid item xs={12} md={4} key={floor.floorId}>
        <FloorCard
          floor={floor}
          handleEdit={() => handleFormOpen(floor)}
          handleDelete={() => handleDeleteConfirm(floor)}
        />
      </Grid>
    ));
  };

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:round-add" />,
      title: 'Add floor',
      onClick: () => handleFormOpen(),
    },
  ];

  const inputs: TextFieldProps[] = [
    {
      name: 'buildingId',
      label: 'Building ID',
      value: formData.buildingId,
    },
    {
      name: 'floorNumber',
      label: 'Floor Number',
      value: formData.floorNumber,
    },
  ];

  const open = dialogState.isOpen;
  const isEditing = dialogState.isEditing;
  const handleClose = handleFormClose;

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />
      <FormDialog
        open={open}
        isEditing={isEditing}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        textInput={inputs}
      />
      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">Floors</Typography>
        </Grid>

        <Grid item xs={12}>
          <FloorFilter
            floors={floors}
            selectedBuildingIds={selectedBuildingIds}
            setSelectedBuildingIds={setSelectedBuildingIds}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            {renderFloorCards()}
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onClose={
          deleteDialog.isSubmitting
            ? undefined
            : () => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this floor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
            color="secondary"
            disabled={deleteDialog.isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleteDialog.isSubmitting}>
            {deleteDialog.isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Floors;
