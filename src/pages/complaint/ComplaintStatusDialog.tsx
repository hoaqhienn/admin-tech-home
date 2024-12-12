import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

interface ComplaintStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
  currentStatus: string;
}

const ComplaintStatusDialog: React.FC<ComplaintStatusDialogProps> = ({
  open,
  onClose,
  onStatusUpdate,
  currentStatus,
}) => {
  const [status, setStatus] = useState(currentStatus);

  const handleSubmit = () => {
    onStatusUpdate(status);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật trạng thái</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplaintStatusDialog;
