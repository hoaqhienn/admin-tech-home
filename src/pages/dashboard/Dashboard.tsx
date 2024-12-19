import { Grid, Typography } from '@mui/material';
import React from 'react';
import MyInfo from './MyInfo';
import OverviewPage from './Overview';
import BuildingResidentsChart from 'pages/properties/Buildings/BuildingResidentsChart';
import FloorResidentsChart from 'pages/properties/Floors/FloorResidentsChart';
import ApartmentPieChart from 'pages/properties/Apartments/ApartmentPieChart';
import ResidentsPieChart from 'pages/residents/ResidentsPieChart';
import VehiclePieChart from 'pages/residents/vehicles/VehiclePieChart';
import ComplaintPieChart from 'pages/complaint/ComplaintPieChart';

const Dashboard: React.FC = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Trang chủ</Typography>
        </Grid>
        <Grid item xs={12}>
          <MyInfo />
        </Grid>
        <Grid item xs={12}>
          <OverviewPage />
        </Grid>
        <Grid item xs={6}>
          <BuildingResidentsChart />
        </Grid>
        <Grid item xs={6}>
          <FloorResidentsChart />
        </Grid>
        <Grid item xs={6}>
          <ApartmentPieChart />
        </Grid>
        <Grid item xs={6}>
          <ResidentsPieChart />
        </Grid>
        <Grid item xs={6}>
          <VehiclePieChart />
        </Grid>
        <Grid item xs={6}>
          <ComplaintPieChart />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
