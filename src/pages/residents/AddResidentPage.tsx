import { Grid, Typography } from '@mui/material';
import ExcelInput from './add/ExcelInput';

const AddResidentPage = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Thêm cư dân</Typography>
        </Grid>
        <Grid item xs={12}>
          <ExcelInput />
        </Grid>
      </Grid>
    </>
  );
};

export default AddResidentPage;
