import { Divider, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Properties</Typography>
          <Divider />
        </Grid>
        <Grid item md={3}>
          <Paper>
            <Typography variant="h4">Buildings</Typography>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper>
            <Typography variant="h4">Floors</Typography>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper>
            <Typography variant="h4">Apartments</Typography>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper>
            <Typography variant="h4">Facilities</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Users</Typography>
          <Divider />
        </Grid>
        <Grid item md={6}>
          <Paper>
            <Typography variant="h4">Residents</Typography>
          </Paper>
        </Grid>
        <Grid item md={6}>
          <Paper>
            <Typography variant="h4">Vehicles</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">More</Typography>
          <Divider />
        </Grid>
        <Grid item md={4}>
          <Paper>
            <Typography variant="h4">Advertisements</Typography>
          </Paper>
        </Grid>
        <Grid item md={4}>
          <Paper>
            <Typography variant="h4">Events</Typography>
          </Paper>
        </Grid>
        <Grid item md={4}>
          <Paper>
            <Typography variant="h4">Services</Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
