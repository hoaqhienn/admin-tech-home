import { Avatar, Divider, Grid, Typography } from '@mui/material';
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
          <Avatar alt="Remy Sharp" src={user?.user.avatar} />
          <Typography variant="body1">Xin chào, {user?.user.fullname}</Typography>
          <Typography variant="body1">Your id, {user?.user.userId}</Typography>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
