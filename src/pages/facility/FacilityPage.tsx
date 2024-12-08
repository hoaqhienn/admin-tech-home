import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import FacilityDataGrid from './FacilityDataGrid';

const FacilityPage = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách cơ sở vật chất</Typography>
        </Grid>
        <Grid item xs={12}>
          <FacilityDataGrid />
        </Grid>
      </Grid>
    </>
  );
};

export default FacilityPage;
