import Grid from '@mui/material/Grid';
import { Divider, Typography } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import ComplaintDataGrid from './ComplaintDataGrid';
import { useDeleteComplaintMutation, useUpdateComplaintStatusMutation } from 'api/serviceApi';
import { useState } from 'react';
import { useSocket } from 'components/provider/SocketProvider';
import ComplaintDataGrid4 from './ComplaintDataGrid4';
import ComplaintDataGrid2 from './ComplaintDataGrid2';
import ComplaintDataGrid3 from './ComplaintDataGrid3';
import ComplaintPieChart from './ComplaintPieChart';

// Define types
interface DeleteResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  data?: {
    message: string;
  };
  status?: number;
}

const ComplaintPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [updateComplaintStatus] = useUpdateComplaintStatusMutation();

  const { socket } = useSocket();

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const result: any = await updateComplaintStatus({ id, status });
      console.log('result', result.data.data);

      if ('data' in result) {
        // setShowSuccess(true);

        if (socket) {
          // Gửi `userId` và `complaint` dưới dạng hai tham số riêng biệt
          socket.emit(
            'sendNotificationComplaint',
            result.data.data.residentId, // userId
            result.data.data, // complaint
          );
        } else {
          console.error('Socket is not initialized');
        }
      } else if ('error' in result) {
        const errorMessage =
          (result.error as ErrorResponse).data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Explicitly type the mutation response
  const [deleteComplaintMutation] = useDeleteComplaintMutation<{
    data: DeleteResponse;
    error: ErrorResponse;
  }>();

  const handleDelete = async (id: number) => {
    try {
      // Don't cast the response, instead access the data property
      const result = await deleteComplaintMutation(id);

      // Check if the request was successful using RTK Query's properties
      if ('data' in result) {
        setShowSuccess(true);
        // You might want to refresh your data here
      } else if ('error' in result) {
        const errorMessage =
          (result.error as ErrorResponse).data?.message || 'Có lỗi xảy ra khi xóa khiếu nại';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi xóa khiếu nại');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách khiếu nại</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Typography
            variant="h4"
            sx={{
              marginTop: 1,
            }}
          >
            Chờ xử lý
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ComplaintDataGrid onDelete={handleDelete} onStatusUpdate={handleStatusUpdate} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Typography
            variant="h4"
            sx={{
              marginTop: 1,
            }}
          >
            Đang xử lý
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ComplaintDataGrid2 onDelete={handleDelete} onStatusUpdate={handleStatusUpdate} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Typography
            variant="h4"
            sx={{
              marginTop: 1,
            }}
          >
            Đã xử lý
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ComplaintDataGrid3 onDelete={handleDelete} onStatusUpdate={handleStatusUpdate} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Typography
            variant="h4"
            sx={{
              marginTop: 1,
            }}
          >
            Đã từ chối
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ComplaintDataGrid4 onDelete={handleDelete} onStatusUpdate={handleStatusUpdate} />
        </Grid>
        <Grid item xs={12}>
          <ComplaintPieChart />
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Xóa khiếu nại thành công
        </Alert>
      </Snackbar>
    </>
  );
};

export default ComplaintPage;
