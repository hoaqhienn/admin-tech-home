import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { Building } from 'interface/Properties';

interface BuildingCardProps {
  building?: Building;
  isLoading?: boolean;
  handleToggle?: (building: Building) => void;
  handleEdit?: (building: Building) => void;
  handleDelete?: (building: Building) => void;
}

export const BuildingCard = ({
  building,
  handleToggle,
  handleEdit,
  handleDelete,
}: BuildingCardProps) => {
  if (!building) return null;
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography variant="h4">{building.buildingName}</Typography>
        <Typography>
          <strong>Address:</strong> {building.buildingAddress}
        </Typography>
        <Typography>
          <strong>Created At:</strong> {new Date(building.createdAt).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Updated At:</strong> {new Date(building.updatedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          sx={{ color: 'blue' }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle?.(building);
          }}
        >
          View
        </Button>
        <Button
          variant="text"
          sx={{ color: 'warning.main' }}
          onClick={() => handleEdit?.(building)}
        >
          Update
        </Button>
        <Button
          variant="text"
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDelete?.(building);
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
