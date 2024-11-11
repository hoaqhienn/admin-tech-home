import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { Service } from 'interface/Service';
import { api } from 'apis';
import { Paper, Typography } from '@mui/material';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);

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
    const updatedAt = new Date().toISOString();

    if (isEditing && currentService) {
      // Update the service
      const updatedService: Service = {
        ...currentService,
        serviceName: newService.serviceName,
        servicePrice: parseFloat(newService.servicePrice),
        createdAt: newService.createdAt,
        updatedAt: updatedAt,
      };

      await api.put(`/admin/service/${currentService.serviceId}`, updatedService);
      setServices(
        services.map((s) => (s.serviceId === currentService.serviceId ? updatedService : s)),
      );
    } else {
      // Add new service
      const createdAt = new Date().toISOString();
      const newServiceData: Omit<Service, 'serviceId'> = {
        serviceName: newService.serviceName,
        servicePrice: parseFloat(newService.servicePrice),
        createdAt,
        updatedAt,
      };

      await api.post('/admin/service', newServiceData);
      setServices([...services, { ...newServiceData, serviceId: services.length + 1 }]);
    }

    handleClose();
  };

  const handleDelete = async (serviceId: number) => {
    await api.delete(`/admin/service/${serviceId}`);
    setServices(services.filter((s) => s.serviceId !== serviceId));
  };

  const fetchAllServices = async () => {
    try {
      const response = await api.get('/admin/service/getAll');
      if (response.status) {
        setServices(response.data);
        console.log('Services:', services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <h1>Services</h1>
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

      {services.length > 0 ? (
        services.map((service) => (
          <Grid item xs={12} md={4} key={service.serviceId}>
            <Paper>
              <Typography variant='h4'>{service.serviceName}</Typography>
              <p>
                <strong>Price:</strong> ${service.servicePrice}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(service.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(service.updatedAt).toLocaleDateString()}
              </p>
              <div style={{ height: '20px' }} />
              <Button
                variant="text"
                sx={{
                  color: 'orange',
                }}
                onClick={() => handleClickOpen(service)}
              >
                Update
              </Button>
              <Button
                variant="text"
                sx={{
                  color: 'red',
                }}
                onClick={() => handleDelete(service.serviceId)}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No services available.</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Services;
