import { Button, Card, CardActions, CardContent, Typography, Skeleton } from '@mui/material';
import { Floor } from 'interface/Properties';

interface FloorCardProps {
  floor?: Floor;
  isLoading?: boolean;
  handleToggle?: (floor: Floor) => void;
  handleEdit?: (floor: Floor) => void;
  handleDelete?: (floor: Floor) => void;
}

export const FloorCard = ({
  floor,
  isLoading = false,
  handleToggle,
  handleEdit,
  handleDelete,
}: FloorCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} /> {/* Floor Number */}
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} /> {/* Building ID */}
          <Skeleton variant="text" width="70%" height={24} sx={{ mt: 1 }} /> {/* Created At */}
          <Skeleton variant="text" width="65%" height={24} sx={{ mt: 1 }} /> {/* Updated At */}
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width={64} height={32} sx={{ borderRadius: 1 }} />{' '}
          {/* Details button */}
          <Skeleton variant="rectangular" width={64} height={32} sx={{ borderRadius: 1 }} />{' '}
          {/* Edit button */}
          <Skeleton variant="rectangular" width={64} height={32} sx={{ borderRadius: 1 }} />{' '}
          {/* Delete button */}
        </CardActions>
      </Card>
    );
  }

  if (!floor) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Floor {floor.floorNumber}</Typography>
        <Typography variant="body2">
          <strong>Building ID:</strong> {floor.buildingId}
        </Typography>
        <Typography variant="body2">
          <strong>Created At:</strong> {new Date(floor.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          <strong>Updated At:</strong> {new Date(floor.updatedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          sx={{ color: 'blue' }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle?.(floor);
          }}
        >
          Details
        </Button>
        <Button
          disabled={true}
          variant="text"
          sx={{ color: 'orange' }}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit?.(floor);
          }}
        >
          Edit
        </Button>
        <Button
          variant="text"
          sx={{ color: 'red' }}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete?.(floor);
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default FloorCard;
