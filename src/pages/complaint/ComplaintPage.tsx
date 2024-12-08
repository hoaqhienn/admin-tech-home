import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import ComplaintDataGrid from './ComplaintDataGrid';

const ComplaintPage = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Danh sách khiếu nại</Typography>
        </Grid>
        <Grid item xs={12}>
          <ComplaintDataGrid />
        </Grid>
      </Grid>
    </>
  );
};

export default ComplaintPage;
