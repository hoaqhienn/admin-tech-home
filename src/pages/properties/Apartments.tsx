import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { Apartment } from 'interface/Properties';
import { api } from 'apis';
import { Paper, Typography } from '@mui/material';

export interface FloorProps {
  floorId: number;
  floorNumber: number;
  apartments: Apartment[];
}

export interface BuildingProps {
  buildingId: number;
  buildingName: string;
  floors: FloorProps[];
}

const Apartments = () => {
  const [buildings, setBuildings] = useState<BuildingProps[]>([]); // Changed from Apartment[] to Building[]
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);

  const [newApartment, setNewApartment] = useState({
    apartmentNumber: '',
    apartmentType: '',
    createdAt: '',
    updatedAt: '',
    floorId: '',
  });

  const [expandedBuildings, setExpandedBuildings] = useState<number[]>([]);
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set());

  const handleClickOpen = (apartment?: Apartment) => {
    if (apartment) {
      setNewApartment({
        apartmentNumber: apartment.apartmentNumber,
        apartmentType: apartment.apartmentType,
        createdAt: apartment.createdAt,
        updatedAt: apartment.updatedAt,
        floorId: apartment.floorId.toString(),
      });
      setCurrentApartment(apartment);
      setIsEditing(true);
    } else {
      setNewApartment({
        apartmentNumber: '',
        apartmentType: '',
        createdAt: '',
        updatedAt: '',
        floorId: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentApartment(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewApartment({ ...newApartment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const updatedAt = new Date().toISOString();

    if (isEditing && currentApartment) {
      // Update the apartment
      const updatedApartment: Apartment = {
        ...currentApartment,
        apartmentNumber: newApartment.apartmentNumber,
        apartmentType: newApartment.apartmentType,
        createdAt: newApartment.createdAt,
        updatedAt: updatedAt,
        floorId: parseInt(newApartment.floorId),
      };

      await api.put(`/admin/apartment/${currentApartment.apartmentId}`, updatedApartment);
      fetchAllApartments();
    } else {
      // Add new apartment
      const createdAt = new Date().toISOString();
      const newApartmentData: Omit<Apartment, 'apartmentId'> = {
        apartmentNumber: newApartment.apartmentNumber,
        apartmentType: newApartment.apartmentType,
        createdAt,
        updatedAt,
        floorId: parseInt(newApartment.floorId),
      };

      await api.post('/admin/apartment', newApartmentData);
      fetchAllApartments();
    }

    handleClose();
  };

  const handleDelete = async (apartmentId: number) => {
    await api.delete(`/admin/apartment/${apartmentId}`);
    fetchAllApartments();
  };

  const fetchAllApartments = async () => {
    try {
      const response = await api.get('/admin/building/detail-include-apartment');
      if (response.status) {
        setBuildings(response.data);
        console.log('Buildings:', buildings);
      }
    } catch (error) {
      console.error('Failed to fetch apartments:', error);
    }
  };

  useEffect(() => {
    fetchAllApartments();
  }, []);

  const toggleBuildingExpansion = (buildingId: number) => {
    setExpandedBuildings((prev) =>
      prev.includes(buildingId) ? prev.filter((id) => id !== buildingId) : [...prev, buildingId],
    );
  };

  const toggleFloorExpansion = (floorId: number) => {
    setExpandedFloors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(floorId)) {
        newSet.delete(floorId);
      } else {
        newSet.add(floorId);
      }
      return newSet;
    });
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Typography variant="h2">Apartments</Typography>
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
        Add Apartment
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Update Apartment' : 'Add New Apartment'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Apartment Number"
            name="apartmentNumber"
            fullWidth
            variant="outlined"
            value={newApartment.apartmentNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Apartment Type"
            name="apartmentType"
            fullWidth
            variant="outlined"
            value={newApartment.apartmentType}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Floor ID"
            name="floorId"
            fullWidth
            variant="outlined"
            value={newApartment.floorId}
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
          <Grid item xs={12} key={building.buildingId}>
            <Paper>
              <div className="flex flex-row items-center justify-between">
                <Typography variant="h3">{building.buildingName}</Typography>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => toggleBuildingExpansion(building.buildingId)}
                >
                  {expandedBuildings.includes(building.buildingId) ? 'Hide' : 'Show'}
                </Button>
              </div>
              {expandedBuildings.includes(building.buildingId) &&
                building.floors.map((floor) => (
                  <Paper
                    sx={{
                      padding: 2,
                      border: 1,
                      marginBottom: 2,
                    }}
                    key={floor.floorId}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <Typography variant="h4">Floor {floor.floorNumber}</Typography>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => toggleFloorExpansion(floor.floorId)}
                      >
                        {expandedFloors.has(floor.floorId) ? 'Hide' : 'Show'}
                      </Button>
                    </div>

                    {expandedFloors.has(floor.floorId) && (
                      <Grid container spacing={2}>
                        {floor.apartments.map((apartment: Apartment) => (
                          <Grid item xs={4} md={4} key={apartment.apartmentId}>
                            <Paper
                              sx={{
                                padding: 2,
                                backgroundColor: '#f6f6f6 ',
                                border: 1,
                              }}
                            >
                              <Typography variant="body2">
                                <strong>Apartment: </strong>
                                {apartment.apartmentNumber}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Type: </strong>
                                {apartment.apartmentType}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Create At: </strong>
                                {new Date(apartment.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Update At: </strong>
                                {new Date(apartment.updatedAt).toLocaleDateString()}
                              </Typography>
                              <Button
                                variant="text"
                                color="warning"
                                onClick={() => handleClickOpen(apartment)}
                              >
                                Update
                              </Button>
                              <Button
                                variant="text"
                                color="error"
                                onClick={() => handleDelete(apartment.apartmentId)}
                              >
                                Delete
                              </Button>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Paper>
                ))}
            </Paper>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No apartments available.</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Apartments;
