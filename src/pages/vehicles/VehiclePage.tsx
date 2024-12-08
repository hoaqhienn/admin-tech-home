import { Grid, Typography } from '@mui/material';
import VehicleDataGrid from './VehicleDataGrid';

const VehiclePage: React.FC = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách phương tiện</Typography>
        </Grid>
        <Grid item xs={12}>
          <VehicleDataGrid />
        </Grid>
      </Grid>
    </>
  );
};

export default VehiclePage;
