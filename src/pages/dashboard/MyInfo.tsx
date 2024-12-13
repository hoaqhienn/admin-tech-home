import { Avatar, Divider, Paper, Typography } from '@mui/material';
import { useAuth } from 'hooks/auth/useAuth';

const MyInfo = () => {
  const { user } = useAuth();

  return (
    <Paper>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          margin: '0 auto',
          display: 'block',
        }}
        alt="Remy Sharp"
        src={user?.user.avatar}
      />
      <Typography variant="h6">Xin chào, {user?.user.fullname}</Typography>
      <Divider />
    </Paper>
  );
};

export default MyInfo;
