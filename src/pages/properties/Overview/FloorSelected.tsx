import { Button, Grid, Paper, Typography } from '@mui/material';
import { Floor } from 'interface/Properties';

interface FloorSelectedProps {
  floors: Floor[];
  currentFloor: Floor | null;
  onFloorSelect: (floor: Floor) => void;
}
export const FloorSelected = ({ floors, currentFloor, onFloorSelect }: FloorSelectedProps) => {
  return (
    <Paper>
      <Grid container>
        <Grid item xs={3} md={2}>
          <Typography variant="h4">Floors</Typography>
        </Grid>
        <Grid item xs={9} md={10}>
          <Grid container spacing={1}>
            {floors.map((floor) => (
              <Grid item xs={2} md={2} key={floor.floorId}>
                <Button
                  sx={{
                    border: '1px solid #cccccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color: currentFloor?.floorId === floor.floorId ? 'blue' : 'black',
                  }}
                  onClick={() => onFloorSelect(floor)}
                >
                  {floor.floorNumber}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
