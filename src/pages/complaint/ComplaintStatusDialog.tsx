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
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface ComplaintStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
  currentStatus: string;
  complaint: { title: string; description: string; date: string; status: string };
}

const ComplaintStatusDialog: React.FC<ComplaintStatusDialogProps> = ({
  open,
  onClose,
  onStatusUpdate,
  currentStatus,
  complaint,
}) => {
  const [status, setStatus] = useState(currentStatus);

  console.log('ComplaintStatusDialog', complaint);

  // Lọc các trạng thái hợp lệ dựa trên trạng thái hiện tại
  const getStatusOptions = () => {
    switch (currentStatus) {
      case 'Pending':
        return ['Rejected', 'In Progress']; // "Pending" có thể cập nhật thành "Rejected" hoặc "In Progress"
      case 'In Progress':
        return ['Resolved']; // "In Progress" có thể cập nhật thành "Resolved"
      case 'Rejected':
      case 'Resolved':
        return []; // "Rejected" và "Resolved" không thể cập nhật trạng thái mới
      default:
        return [];
    }
  };

  useEffect(() => {
    setStatus(currentStatus); // Đảm bảo khi trạng thái cập nhật thì status trong dialog cũng được cập nhật
  }, [currentStatus]);

  const handleSubmit = () => {
    if (status !== currentStatus) {
      onStatusUpdate(status);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật trạng thái</DialogTitle>
      <DialogContent>
        {/* Hiển thị chi tiết khiếu nại */}
        <Typography variant="h6">Tiêu đề: {complaint.title}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Mô tả: {complaint.description || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Ngày tạo: {complaint.date}
        </Typography>

        {/* Hiển thị danh sách các trạng thái hợp lệ */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status || ''}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
            disabled={getStatusOptions().length === 0} // Nếu không có trạng thái hợp lệ thì không thể thay đổi
          >
            {getStatusOptions().map((statusOption) => (
              <MenuItem key={statusOption} value={statusOption}>
                {statusOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={getStatusOptions().length === 0 || status === currentStatus}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplaintStatusDialog;
