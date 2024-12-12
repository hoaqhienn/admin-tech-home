import { useEffect, useState } from 'react';

import { Building } from 'interface/Properties';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

interface EditBuildingDialogProps {
  building: Building | null;
  open: boolean;
  onClose: () => void;
  onSave: (buildingId: number, newName: string) => Promise<void>;
}

const EditBuildingDialog = ({ building, open, onClose, onSave }: EditBuildingDialogProps) => {
  const [buildingName, setBuildingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when dialog opens with new building data
  useEffect(() => {
    if (building) {
      setBuildingName(building.buildingName);
    }
  }, [building]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!building) return;

    setIsLoading(true);
    setError('');

    try {
      await onSave(building.buildingId, buildingName);
      onClose();
    } catch (err) {
      setError('Failed to update building name');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Building Name</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="space-y-4">
            <TextField
              autoFocus
              label="Building Name"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              fullWidth
              required
              error={!!error}
              helperText={error}
              disabled={isLoading}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !buildingName.trim()}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditBuildingDialog;
