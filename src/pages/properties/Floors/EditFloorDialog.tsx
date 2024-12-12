import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Floor } from 'interface/Properties';
import { useState, useEffect } from 'react';
import { useUpdateFloorMutation } from 'api/propertyApi';

interface EditFloorDialogProps {
  open: boolean;
  floor: Floor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditFloorDialog = ({ open, floor, onClose, onSuccess }: EditFloorDialogProps) => {
  const [floorData, setFloorData] = useState<Floor | null>(null);
  const [updateFloor] = useUpdateFloorMutation();

  useEffect(() => {
    if (floor) {
      setFloorData(floor);
    }
  }, [floor]);

  const handleSubmit = async () => {
    if (!floorData) return;

    try {
      await updateFloor(floorData).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update floor:', error);
    }
  };

  const handleChange = (value: string) => {
    if (!floorData) return;

    setFloorData({
      ...floorData,
      floorNumber: parseInt(value).toString(),
    });
  };

  if (!floorData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Floor</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Floor Number"
          type="number"
          fullWidth
          value={floorData.floorNumber || ''}
          onChange={(e) => handleChange(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!floorData.floorNumber}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFloorDialog;
