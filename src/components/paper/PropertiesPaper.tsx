import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { api } from 'apis';
import IconifyIcon from 'components/base/IconifyIcon';
import { Apartment, Building, Floor } from 'interface/Properties';
import { ResidentViaApartment } from 'interface/Residents';
import { useEffect, useState } from 'react';

interface PropertiesPaperProps {
  properties: { name: string; value: string }[];
  buildings: Building[];
  floors: Floor[];
  apartments: Apartment[];
  type: 'building' | 'floor' | 'apartment';
  onClose: () => void;
}

const PropertiesPaper = (props: PropertiesPaperProps) => {
  const { buildings, onClose } = props;
  const [floors, setFloors] = useState<Floor[]>([]);
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [residents, setResidents] = useState<ResidentViaApartment[]>([]);
  const [currentApartment, setCurrentApartment] = useState(-1);

  const handleModalClose = () => {
    onClose();
  };

  const fetchFloors = async () => {
    try {
      const response = await api.get(`/admin/building/${buildings[0].buildingId}`);
      if (response.status) {
        setFloors(response.data.floors);
        console.log('floors:', floors);

        console.log('floors by building id:', response.data.floors);
      }
    } catch (error) {
      console.error('Failed to fetch floors:', error);
    }
  };

  const fetchApartment = async () => {
    console.log('current floor:', currentFloor);
    if (currentFloor === -1) {
      return;
    }
    try {
      const response = await api.get(`/admin/floor/apartment/${currentFloor}`);
      if (response.status) {
        setApartments(response.data);
        console.log('apartments:', apartments);
        console.log('apartments by floor id:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch floors:', error);
    }
  };

  const fetchResidents = async () => {
    console.log('current apartment:', currentApartment);
    if (currentApartment === -1) {
      return;
    }
    try {
      const response = await api.get(`/admin/apartment/resident/${currentApartment}`);
      if (response.status) {
        setResidents(response.data);
        console.log('residents:', residents);
      }
    } catch (error) {
      console.error('Failed to fetch residents:', error);
    }
  };

  const clearResidents = () => {
    setResidents([]);
  }

  useEffect(() => {
    fetchFloors();
  }, []);

  useEffect(() => {
    fetchApartment();
    clearResidents();
  }, [currentFloor]);

  useEffect(() => {
    fetchResidents();
  }, [currentApartment]);

  return (
    <Paper
      sx={{
        width: '90%',
        maxWidth: '90%',
        height: '90%',
        maxHeight: '90%',
        position: 'relative',
        padding: 2,
        backgroundColor: '#f4f7fe',
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h2">Properties</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Building: {buildings[0].buildingId}</Typography>
          <Typography variant="body2"> - Name: {buildings[0].buildingName}</Typography>
          <Typography variant="body2"> - Address:</Typography>
          <Typography variant="body2"> - Number of floors:</Typography>
          <Typography variant="body2"> - Number of residents:</Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Typography variant="h4">
              Floor {floors.length > 0 ? `(${floors.length})` : ''}
            </Typography>
            <Paper
              style={{
                height: 350,
                maxHeight: 350,
                overflowY: 'auto',
              }}
            >
              <List>
                {floors.map((floor) => (
                  <ListItem
                    key={floor.floorId}
                    button
                    onClick={() => setCurrentFloor(floor.floorId)}
                    divider
                    sx={{
                      maxHeight: 300,
                      overflowY: 'auto',
                    }}
                  >
                    <ListItemText primary={`Floor: ${floor.floorNumber}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Typography variant="h4">
              Apartment {apartments.length > 0 ? `(${apartments.length})` : ''}
            </Typography>
            <Paper
              style={{
                height: 350,
                maxHeight: 350,
                overflowY: 'auto',
              }}
            >
              <List>
                {apartments.map((apartment) => (
                  <ListItem
                    key={apartment.apartmentId}
                    button
                    onClick={() => setCurrentApartment(apartment.apartmentId)}
                    divider
                    sx={{
                      maxHeight: 300,
                      overflowY: 'auto',
                    }}
                  >
                    <ListItemText
                      primary={`Number: ${apartment.apartmentId} (${apartment.apartmentType})`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h4">
              Resident {residents.length > 0 ? `(${residents.length})` : ''}
            </Typography>
            <Paper
              style={{
                height: 350,
                maxHeight: 350,
                overflowY: 'auto',
              }}
            >
              <List>
                {residents.map((resident) => (
                  <ListItem
                    key={resident.residentId}
                    button
                    onClick={() => console.log('resident:', resident)}
                    divider
                    sx={{
                      maxHeight: 300,
                      overflowY: 'auto',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={resident.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${resident.fullname} (${resident.username})`}
                      secondary={`${resident.idcard} - ${resident.phonenumber} - ${resident.email}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1,
        }}
        onClick={handleModalClose}
        size="large"
      >
        <IconifyIcon icon="ic:outline-close" />
      </IconButton>
    </Paper>
  );
};

export default PropertiesPaper;
