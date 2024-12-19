import { Divider, Paper, Typography } from '@mui/material';
import { useGetApartmentsQuery, useGetResidentsQuery } from 'api';

const OverviewPage = () => {
  const { data: apartments = [] } = useGetApartmentsQuery();
  const { data: residents = [] } = useGetResidentsQuery();

  return (
    <Paper>
      <Typography variant="h2">Tổng quan</Typography>
      <Typography variant="h6">Số căn hộ: {apartments.length}</Typography>
      <Typography variant="h6">Số cư dân: {residents.length}</Typography>

      <Divider />
    </Paper>
  );
};

export default OverviewPage;
