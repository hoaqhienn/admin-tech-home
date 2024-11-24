import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import { ResidentViaApartment } from 'interface/Residents';

interface ResidentViewProps {
  residents: ResidentViaApartment[];
}

export const ResidentView = ({ residents }: ResidentViewProps) => {
  if (!residents || residents.length === 0) {
    return (
      <Paper>
        <Typography variant="h4">Residents</Typography>
        <Typography>No residents found.</Typography>
      </Paper>
    );
  }
  return (
    <Paper>
      <Typography variant="h4">Residents </Typography>
      <Grid container spacing={1} marginY={1}>
        {residents.map((resident) => (
          <Grid item xs={6} md={3} key={resident.residentId}>
            <Paper
              sx={{
                border: 1,
                borderColor: 'grey.500',
                maxHeight: '100%',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                  src={resident.avatar}
                />
              </Box>
              <Typography>
                <strong>Username: </strong> {resident.username}
              </Typography>
              <Typography>
                <strong>Identity: </strong>
                {resident.idcard}
              </Typography>
              <Typography>
                <strong>Name: </strong>
                {resident.fullname}
              </Typography>
              <Typography>
                <strong>Email: </strong>
                {resident.email}
              </Typography>
              <Typography>
                <strong>Phone: </strong>
                {resident.phonenumber}
              </Typography>
              <Typography>
                <strong>Gender:</strong>
              </Typography>
              <Typography>
                <strong>Birthdate:</strong>
              </Typography>
              <Typography>
                <strong>Place of Origin:</strong>
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
