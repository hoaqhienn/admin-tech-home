import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import BillDataGrid from './BillDataGrid';
import PaymentDataGrid from './PaymentDataGrid';

const Events = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách hóa đơn</Typography>
        </Grid>
        <Grid item xs={12}>
          <BillDataGrid />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h1">Lịch sử thanh toán</Typography>
        </Grid>
        <Grid item xs={12}>
          <PaymentDataGrid />
        </Grid>
      </Grid>
    </>
  );
};

export default Events;
