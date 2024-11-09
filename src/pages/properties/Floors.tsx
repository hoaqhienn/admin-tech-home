import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { Floor } from 'interface/Properties';
import { api } from 'apis';
import { DialogActions, Paper, Typography } from '@mui/material';

interface BuildingProps {
  buildingId: number;
  buildingName: string;
  floors: Floor[];
}

const Floors = () => {
  const [floors, setFloors] = useState<BuildingProps[]>([]);
  const [expandedBuildings, setExpandedBuildings] = useState<number[]>([]);
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
      fetchAllFloors();
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
      fetchAllFloors();
    }

    handleClose();
  };

  const handleDelete = async (floorId: number) => {
    await api.delete(`/admin/floor/${floorId}`);
    fetchAllFloors();
  };

  const fetchAllFloors = async () => {
    try {
      const response = await api.get('/admin/building/detail');
      if (response.status) {
        setFloors(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch floors:', error);
    }
  };

  useEffect(() => {
    fetchAllFloors();
  }, []);

  const toggleBuilding = (buildingId: number) => {
    setExpandedBuildings((prev) =>
      prev.includes(buildingId) ? prev.filter((id) => id !== buildingId) : [...prev, buildingId],
    );
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Typography variant="h2"> Floors </Typography>
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

      {floors.map((building) => (
        <Grid item xs={12} key={building.buildingId}>
          <Paper>
            <div className="flex flex-row items-center justify-between">
              <Typography variant="h5">{building.buildingName}</Typography>
              <Button variant="text" onClick={() => toggleBuilding(building.buildingId)}>
                {expandedBuildings.includes(building.buildingId) ? 'Show Less' : 'Show All Floors'}
              </Button>
            </div>
            <Grid container spacing={2}>
              {(expandedBuildings.includes(building.buildingId)
                ? building.floors
                : building.floors.slice(0, 3)
              ).map((floor) => (
                <Grid item xs={4} md={4} key={floor.floorId}>
                  <Paper
                    sx={{
                      padding: 2,
                      backgroundColor: '#f6f6f6 ',
                      border: 1,
                    }}
                    elevation={1}
                    onClick={() => handleClickOpen(floor)}
                    style={{ padding: '16px', cursor: 'pointer' }}
                  >
                    <Typography variant="h6">Floor {floor.floorNumber}</Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong> {new Date(floor.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Updated At:</strong> {new Date(floor.updatedAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickOpen(floor);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(floor.floorId);
                      }}
                    >
                      Delete
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Floors;
