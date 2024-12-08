import { Divider, Grid, Typography } from '@mui/material';
import { useAuth } from 'hooks/auth/useAuth';
import React from 'react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  console.log('user :: ', user);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Trang chủ</Typography>
          <Typography variant="body1">Xin chào, {user?.user.fullname}</Typography>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
