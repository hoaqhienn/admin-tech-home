import { Button, Grid, Paper, Typography } from '@mui/material';
import { Apartment } from 'interface/Properties';

interface ApartmentSelectedProps {
  apartments: Apartment[];
  currentApartment: Apartment | null;
  onApartmentSelect: (apartment: Apartment) => void;
}

export const ApartmentSelected = ({
  apartments,
  currentApartment,
  onApartmentSelect,
}: ApartmentSelectedProps) => {
  return (
    <Paper>
      <Grid container spacing={1}>
        <Grid item xs={3} md={2}>
          <Typography variant="h4">Apartments</Typography>
        </Grid>
        <Grid item xs={9} md={10}>
          <Grid container spacing={1}>
            {apartments.map((apartment) => (
              <Grid item xs={2} md={2} key={apartment.apartmentId}>
                <Button
                  sx={{
                    border: '1px solid #cccccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color:
                      currentApartment?.apartmentId === apartment.apartmentId ? 'blue' : 'black',
                  }}
                  onClick={() => onApartmentSelect(apartment)}
                >
                  {apartment.apartmentNumber}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
