import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Resident } from 'interface/Residents';
import { api } from 'apis';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const Residents = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentResident, setCurrentResident] = useState<Resident | null>(null);

  const [newResident, setNewResident] = useState({
    phonenumber: '',
    idcard: '',
    active: true,
    User: {
      avatar: '',
      fullname: '',
      username: '',
      email: '',
      roleId: 0,
    },
  });

  const handleClickOpen = (resident?: Resident) => {
    if (resident) {
      setNewResident({
        phonenumber: resident.phonenumber,
        idcard: resident.idcard,
        active: resident.active,
        User: {
          avatar: resident.User.avatar,
          fullname: resident.User.fullname,
          username: resident.User.username,
          email: resident.User.email,
          roleId: resident.User.roleId,
        },
      });
      setCurrentResident(resident);
      setIsEditing(true);
    } else {
      setNewResident({
        phonenumber: '',
        idcard: '',
        active: true,
        User: {
          avatar: '',
          fullname: '',
          username: '',
          email: '',
          roleId: 0,
        },
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentResident(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewResident({ ...newResident, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const updatedAt = new Date().toISOString();

    if (isEditing && currentResident) {
      // Update the Resident
    } else {
      // Add new resident
      const createdAt = new Date().toISOString();
      const newResidentData: Omit<Resident, 'residentId'> = {
        phonenumber: newResident.phonenumber,
        idcard: newResident.idcard,
        active: newResident.active,
        userId: newResident.User.roleId,
        User: {
          avatar: newResident.User.avatar,
          fullname: newResident.User.fullname,
          username: newResident.User.username,
          email: newResident.User.email,
          roleId: newResident.User.roleId,
          userId: 0,
          createdAt,
          updatedAt,
        },
        createdAt: '',
        updatedAt,
      };

      await api.post('/admin/registerResident', newResidentData);
      setResidents([...residents, { ...newResidentData, residentId: residents.length + 1 }]);
    }

    handleClose();
  };

  const fetchAllResidents = async () => {
    try {
      const response = await api.get('/admin/resident/getAll');
      if (response.status) {
        setResidents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch residents:', error);
    }
  };

  const isActive = async (resident: Resident) => {
    const updatedResident = { ...resident, active: !resident.active };
    try {
      await api.put(`/admin/resident/${resident.residentId}`, updatedResident);
      fetchAllResidents();
    } catch (error) {
      console.error('Failed to update resident:', error);
    }
  };

  useEffect(() => {
    fetchAllResidents();
    console.log('Residents:', residents);
  }, []);


  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <h1>Residents</h1>
      </Grid>

      <Button
        type="button"
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
        Add Resident
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Update Resident' : 'Add New Resident'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            name="fullname"
            fullWidth
            variant="outlined"
            value={newResident.User.fullname}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            variant="outlined"
            value={newResident.User.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="ID Card"
            name="idcard"
            fullWidth
            variant="outlined"
            value={newResident.idcard}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            name="phonenumber"
            fullWidth
            variant="outlined"
            value={newResident.phonenumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email Address"
            name="email"
            fullWidth
            variant="outlined"
            value={newResident.User.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Avatar"
            name="avatar"
            fullWidth
            variant="outlined"
            value={newResident.User.avatar}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Role ID"
            name="roleId"
            fullWidth
            variant="outlined"
            value={newResident.User.roleId}
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

      {residents.length > 0 ? (
        residents.map((resident) => (
          <Grid item xs={12} md={3} key={resident.residentId}>
            <div>
              <h2>
                {resident.User.fullname} ({resident.User.username})
              </h2>
              <img
                src={resident.User.avatar}
                alt={resident.User.fullname}
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />

              <p>
                <strong>ID Card:</strong> {resident.idcard}
              </p>
              <p>
                <strong>Phone Number:</strong> {resident.phonenumber} 
              </p>
              <p>
                <strong>User Email:</strong> {resident.User.email}
              </p>
              <p>
                <strong>Active:</strong> {resident.active ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Created At:</strong> {resident.createdAt}
              </p>
              <p>
                <strong>Updated At:</strong> {resident.updatedAt}
              </p>
              <Button variant="contained" color="warning" onClick={() => handleClickOpen(resident)}>
                Update
              </Button>
              {/* create button to active / de active resident */}
              <Button variant="contained"color={resident.active ? 'primary' : 'secondary'} onClick={() => isActive(resident)}>
                {resident.active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No residents available.</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Residents;
