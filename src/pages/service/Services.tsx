import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

import { Service } from 'interface/Service';
import ServiceDataGrid from './ServiceDataGrid';
import { Typography } from '@mui/material';

const Services = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  console.log(currentService);

  const [newService, setNewService] = useState({
    serviceName: '',
    servicePrice: '',
    createdAt: '',
    updatedAt: '',
  });

  const handleClickOpen = (service?: Service) => {
    if (service) {
      setNewService({
        serviceName: service.serviceName,
        servicePrice: service.servicePrice.toString(),
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      });
      setCurrentService(service);
      setIsEditing(true);
    } else {
      setNewService({
        serviceName: '',
        servicePrice: '',
        createdAt: '',
        updatedAt: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentService(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    handleClose();
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Typography variant="h1">Danh sách dịch vụ</Typography>
      </Grid>
      <Grid item xs={12}>
        <ServiceDataGrid />
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
        Add Service
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Update Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Service Name"
            name="serviceName"
            fullWidth
            variant="outlined"
            value={newService.serviceName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Service Price"
            name="servicePrice"
            fullWidth
            variant="outlined"
            value={newService.servicePrice}
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
    </Grid>
  );
};

export default Services;
