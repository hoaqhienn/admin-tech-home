import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { Apartment } from 'interface/Properties';

interface ApartmentCardProps {
  apartment?: Apartment;
  isLoading?: boolean;
  handleToggle?: (apartment: Apartment) => void;
  handleEdit?: (apartment: Apartment) => void;
  handleDelete?: (apartment: Apartment) => void;
}

export const ApartmentCard = ({
  apartment,
  handleToggle,
  handleEdit,
  handleDelete,
}: ApartmentCardProps) => {
  if (!apartment) return null;
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
        <Typography variant="h4">{apartment.apartmentNumber}</Typography>
        <Typography>
          <strong>Floor ID:</strong> {apartment.floorId}
        </Typography>
        <Typography>
          <strong>Apartment ID:</strong> {apartment.apartmentId}
        </Typography>
        <Typography>
          <strong>Apartment Type:</strong> {apartment.apartmentType}
        </Typography>
        <Typography>
          <strong>Created At:</strong> {new Date(apartment.createdAt).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Updated At:</strong> {new Date(apartment.updatedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          sx={{ color: 'blue' }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle?.(apartment);
          }}
        >
          View
        </Button>
        <Button
          variant="text"
          sx={{ color: 'warning.main' }}
          onClick={() => handleEdit?.(apartment)}
        >
          Update
        </Button>
        <Button
          variant="text"
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDelete?.(apartment);
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
