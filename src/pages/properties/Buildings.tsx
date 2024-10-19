import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { Building } from 'interface/Properties';
import { api } from 'apis';

const Buildings = () => {

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null); 

  const [newBuilding, setNewBuilding] = useState({
    buildingName: '',
    buildingAddress: '',
  });

  const handleClickOpen = (building?: Building) => {
    if (building) {
      // Edit mode
      setNewBuilding({
        buildingName: building.buildingName,
        buildingAddress: building.buildingAddress,
      });
      setCurrentBuilding(building);
      setIsEditing(true);
    } else {
      // Add mode
      setNewBuilding({
        buildingName: '',
        buildingAddress: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentBuilding(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBuilding({ ...newBuilding, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const updatedAt = new Date().toISOString();

    if (isEditing && currentBuilding) {
      // Update the building
      const updatedBuilding: Building = {
        ...currentBuilding,
        buildingName: newBuilding.buildingName,
        buildingAddress: newBuilding.buildingAddress,
        updatedAt,
      };

      await api.put(`/admin/building/${currentBuilding.buildingId}`, updatedBuilding);
      setBuildings(
        buildings.map((b) => (b.buildingId === currentBuilding.buildingId ? updatedBuilding : b)),
      );
    } else {
      // Add new building
      const createdAt = new Date().toISOString();
      const newBuildingData: Omit<Building, 'buildingId'> = {
        buildingName: newBuilding.buildingName,
        buildingAddress: newBuilding.buildingAddress,
        createdAt,
        updatedAt,
      };


      await api.post('/admin/building', newBuildingData);

      setBuildings([...buildings, { ...newBuildingData, buildingId: buildings.length + 1 }]);
    }

    setNewBuilding({
      buildingName: '',
      buildingAddress: '',
    });
    handleClose();
  };

  const handleDelete = async (buildingId: number) => {
    await api.delete(`/admin/building/${buildingId}`);
    setBuildings(buildings.filter((b) => b.buildingId !== buildingId));
  };

  // fetchAllBuilding function
  const fetchAllBuilding = async () => {
    try {
      const response = await api.get('/admin/building/getAll');
      if (response.status) {
        setBuildings(response.data);
        console.log('Buildings:', buildings);
        
      }
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    }
  };

  useEffect(() => {
    fetchAllBuilding();
  }, []);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <h1>Buildings</h1>
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
        Add Building
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Update Building' : 'Add New Building'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Building Name"
            name="buildingName"
            fullWidth
            variant="outlined"
            value={newBuilding.buildingName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Building Address"
            name="buildingAddress"
            fullWidth
            variant="outlined"
            value={newBuilding.buildingAddress}
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

      {buildings.length > 0 ? (
        buildings.map((building) => (
          <Grid item xs={12} md={2} key={building.buildingId}>
            <div>
              <h2>{building.buildingName}</h2>
              <p>
                <strong>Address:</strong> {building.buildingAddress}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(building.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(building.updatedAt).toLocaleDateString()}
              </p>
              <Button variant="contained" color="warning" onClick={() => handleClickOpen(building)}>
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(building.buildingId)}
              >
                Delete
              </Button>
            </div>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No buildings available.</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Buildings;
