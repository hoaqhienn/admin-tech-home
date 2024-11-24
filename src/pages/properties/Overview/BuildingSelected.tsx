import { Button, Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import { Building } from 'interface/Properties';

interface BuildingSelectedProps {
  buildings: Building[];
  currentBuilding: Building | null;
  onBuildingSelect: (building: Building) => void;
}

export const BuildingSelected = ({
  buildings,
  currentBuilding,
  onBuildingSelect,
}: BuildingSelectedProps) => {
  return (
    <Paper>
      <Grid container>
        <Grid md={2} xs={3}>
          <Typography variant="h4">Buildings</Typography>
        </Grid>
        <Grid md={10} xs={9}>
          <Grid container spacing={1}>
            {buildings.map((building) => (
              <Grid item xs={2} md={2} key={building.buildingId}>
                <Button
                  sx={{
                    border: '1px solid #cccccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color: currentBuilding?.buildingId === building.buildingId ? 'blue' : 'black',
                  }}
                  onClick={() => onBuildingSelect(building)}
                >
                  {building.buildingId}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {currentBuilding && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">{currentBuilding.buildingName}</Typography>
                <Typography variant="body1">{currentBuilding.buildingAddress}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
