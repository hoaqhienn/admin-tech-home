import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { NewNotify, Notify } from 'interface/Utils';

interface NotifyFormDialogProps {
  open: boolean;
  onClose: () => void;
  notification: Notify | null | undefined; // Updated type here
  onSubmit: (data: NewNotify) => Promise<void>;
  title: string;
}

const NotifyFormDialog: React.FC<NotifyFormDialogProps> = ({
  open,
  onClose,
  notification,
  onSubmit,
  title,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewNotify>({
    defaultValues: {
      notificationTitle: notification?.notificationTitle || '',
      notificationBody: notification?.notificationBody || '',
    },
  });

  const onFormSubmit = async (data: NewNotify) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting notification:', error);
    }
  };

  React.useEffect(() => {
    if (open) {
      reset({
        notificationTitle: notification?.notificationTitle || '',
        notificationBody: notification?.notificationBody || '',
      });
    }
  }, [open, notification, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Stack spacing={2} direction={'column'}>
            {(errors.notificationTitle || errors.notificationBody) && (
              <Alert severity="error">Vui lòng điền đầy đủ thông tin</Alert>
            )}
            <TextField
              label="Tiêu đề"
              fullWidth
              {...register('notificationTitle', { required: true })}
              error={!!errors.notificationTitle}
            />
            <TextField
              label="Nội dung"
              fullWidth
              multiline
              rows={4}
              {...register('notificationBody', { required: true })}
              error={!!errors.notificationBody}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {notification ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NotifyFormDialog;
