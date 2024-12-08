import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import EventDataGrid from './EventDataGrid';

const Events = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách sự kiện</Typography>
        </Grid>
        <Grid item xs={12}>
          <EventDataGrid />
        </Grid>
      </Grid>
    </>
  );
};

export default Events;
