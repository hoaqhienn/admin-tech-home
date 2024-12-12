import { Grid, Typography } from '@mui/material';
import React from 'react';
import MyInfo from './MyInfo';
// import ExcelDashboard from './ExcelDashboard';

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
        {/* <Grid item xs={12}>
          <ExcelDashboard />
        </Grid> */}
      </Grid>
    </>
  );
};

export default Dashboard;
