import { Divider, Paper, Typography } from '@mui/material';
import { useGetApartmentsQuery, useGetComplaintsQuery } from 'api';

const OverviewPage = () => {
  const { data: apartments = [] } = useGetApartmentsQuery();
  const { data: complaints = [] } = useGetComplaintsQuery();

  return (
    <Paper>
      <Typography variant="h2">Tổng quan</Typography>
      <Typography variant="h6">
        Số căn hộ: {apartments.filter((apt) => apt.residents.length > 0).length} /{' '}
        {apartments.length} (được sử dụng)
      </Typography>
      <Typography variant="h6">
        Số khiếu nại chờ giải quyết:{' '}
        {complaints.filter((complaint) => complaint.complaintStatus === 'Pending').length}
      </Typography>

      <Divider />
    </Paper>
  );
};

export default OverviewPage;
