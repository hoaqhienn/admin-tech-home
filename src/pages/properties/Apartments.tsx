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

const Apartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
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
      setApartments(
        apartments.map((a) =>
          a.apartmentId === currentApartment.apartmentId ? updatedApartment : a,
        ),
      );
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
      setApartments([...apartments, { ...newApartmentData, apartmentId: apartments.length + 1 }]);
    }

    handleClose();
  };

  const handleDelete = async (apartmentId: number) => {
    await api.delete(`/admin/apartment/${apartmentId}`);
    setApartments(apartments.filter((a) => a.apartmentId !== apartmentId));
  };

  const fetchAllApartments = async () => {
    try {
      const response = await api.get('/admin/apartment/getAll');
      if (response.status) {
        setApartments(response.data);
        console.log('Buildings:', apartments);
        
      }
    } catch (error) {
      console.error('Failed to fetch apartments:', error);
    }
  };

  useEffect(() => {
    fetchAllApartments();
  }, []);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <h1>Apartments</h1>
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

      {apartments.length > 0 ? (
        apartments.map((apartment) => (
          <Grid item xs={12} md={2} key={apartment.apartmentId}>
            <div>
              <h2>{apartment.apartmentNumber}</h2>
              <p>
                <strong>Type:</strong> {apartment.apartmentType}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(apartment.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(apartment.updatedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Floor ID:</strong> {apartment.floorId}
              </p>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleClickOpen(apartment)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(apartment.apartmentId)}
              >
                Delete
              </Button>
            </div>
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
