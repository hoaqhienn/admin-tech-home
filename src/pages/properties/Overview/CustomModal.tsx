import { Box, Button, IconButton, Modal, Paper, TextField, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useBuildings } from 'hooks/useBuilding';
import { Building } from 'interface/Properties';
import { useCallback, useState } from 'react';

interface ModalProps {
  title: string;
  currentBuilding?: Building;
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
}

interface BuildingFormData {
  buildingName: string;
  buildingAddress: string;
}

const INITIAL_BUILDING_STATE = { buildingName: '', buildingAddress: '' };

const FORM_FIELDS = [
  { label: 'Building Name', name: 'buildingName' as const, type: 'text' },
  { label: 'Building Address', name: 'buildingAddress' as const, type: 'text' },
] as const;

export const CustomModal = ({ title, open, onClose, isEditing, currentBuilding }: ModalProps) => {
  const [formData, setFormData] = useState<BuildingFormData>(() =>
    isEditing && currentBuilding
      ? {
          buildingName: currentBuilding.buildingName,
          buildingAddress: currentBuilding.buildingAddress,
        }
      : INITIAL_BUILDING_STATE,
  );

  const [newBuilding, setNewBuilding] = useState(INITIAL_BUILDING_STATE);
  // const { addBuilding, updateBuilding } = useBuildings();
  const { updateBuilding } = useBuildings();

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
      };
      try {
        // await addBuilding(newBuildingData);
        console.log('Adding building:', newBuildingData);
      } catch (error) {
        console.error('Error adding new building:', error);
      }
    }

    setNewBuilding(INITIAL_BUILDING_STATE);
  }, [isEditing, currentBuilding, newBuilding]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          width: '95%',
          maxWidth: '95%',
          height: '95%',
          maxHeight: '95%',
          position: 'relative',
          padding: 1,
          backgroundColor: '#f6f6f6',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
          }}
          onClick={onClose}
          size="large"
        >
          <IconifyIcon icon="ic:outline-close" />
        </IconButton>
        <Typography>{title}</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {FORM_FIELDS.map(({ label, name, type }) => (
            <TextField
              key={name}
              fullWidth
              required
              margin="dense"
              label={label}
              name={name}
              type={type}
              variant="outlined"
              value={formData[name]}
              onChange={handleInputChange}
            />
          ))}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};
