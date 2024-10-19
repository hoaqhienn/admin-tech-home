import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { Floor } from 'interface/Properties';
import { api } from 'apis';

const Floors = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);

  const [newFloor, setNewFloor] = useState({
    floorNumber: '',
    createdAt: '',
    updatedAt: '',
    buildingId: '',
  });

  const handleClickOpen = (floor?: Floor) => {
    if (floor) {
      setNewFloor({
        floorNumber: floor.floorNumber,
        createdAt: floor.createdAt,
        updatedAt: floor.updatedAt,
        buildingId: floor.buildingId.toString(),
      });
      setCurrentFloor(floor);
      setIsEditing(true);
    } else {
      setNewFloor({
        floorNumber: '',
        createdAt: '',
        updatedAt: '',
        buildingId: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentFloor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFloor({ ...newFloor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const updatedAt = new Date().toISOString();

    if (isEditing && currentFloor) {
      // Update the floor
      const updatedFloor: Floor = {
        ...currentFloor,
        floorNumber: newFloor.floorNumber,
        createdAt: newFloor.createdAt,
        updatedAt: updatedAt,
        buildingId: parseInt(newFloor.buildingId),
      };

      await api.put(`/admin/floor/${currentFloor.floorId}`, updatedFloor);
      setFloors(floors.map((f) => (f.floorId === currentFloor.floorId ? updatedFloor : f)));
    } else {
      // Add new floor
      const createdAt = new Date().toISOString();
      const newFloorData: Omit<Floor, 'floorId'> = {
        floorNumber: newFloor.floorNumber,
        createdAt,
        updatedAt,
        buildingId: parseInt(newFloor.buildingId),
      };

      await api.post('/admin/floor', newFloorData);
      setFloors([...floors, { ...newFloorData, floorId: floors.length + 1 }]);
    }

    handleClose();
  };

  const handleDelete = async (floorId: number) => {
    await api.delete(`/admin/floor/${floorId}`);
    setFloors(floors.filter((f) => f.floorId !== floorId));
  };

  const fetchAllFloors = async () => {
    try {
      const response = await api.get('/admin/floor/getAll');
      if (response.status) {
        setFloors(response.data);
        console.log('Floors:', floors);
      }
    } catch (error) {
      console.error('Failed to fetch floors:', error);
    }
  };

  useEffect(() => {
    fetchAllFloors();
  }, []);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <h1>Floors</h1>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        size="medium"
        onClick={() => handleClickOpen()}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        Add Floor
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Update Floor' : 'Add New Floor'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Floor Number"
            name="floorNumber"
            fullWidth
            variant="outlined"
            value={newFloor.floorNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Building ID"
            name="buildingId"
            fullWidth
            variant="outlined"
            value={newFloor.buildingId}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {floors.length > 0 ? (
        floors.map((floor) => (
          <Grid item xs={12} md={2} key={floor.floorId}>
            <div>
              <h2>{floor.floorNumber}</h2>
              <p>
                <strong>Building ID:</strong> {floor.buildingId}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(floor.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(floor.updatedAt).toLocaleDateString()}
              </p>

              <Button variant="contained" color="warning" onClick={() => handleClickOpen(floor)}>
                Update
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(floor.floorId)}>
                Delete
              </Button>
            </div>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No floors available.</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Floors;
