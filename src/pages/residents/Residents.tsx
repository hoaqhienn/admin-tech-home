import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import ResidentsDataGrid from './ResidentsDataGrid';
import AddResident from './AddResident';

const Residents = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách cư dân</Typography>
        </Grid>
        <Grid item xs={12}>
          <ResidentsDataGrid />
        </Grid>

        <Grid item xs={12}>
          <AddResident setSnackbar={setSnackbar} />
        </Grid>
      </Grid>
    </>
  );
};

export default Residents;
