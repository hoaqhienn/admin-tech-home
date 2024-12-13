import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useChangePasswordMutation } from 'api/authApi';

// Define the form input types
interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Validation schema
const schema = yup
  .object({
    currentPassword: yup
      .string()
      .required('Mật khẩu hiện tại là bắt buộc'),
      // .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    newPassword: yup
      .string()
      .required('Mật khẩu mới là bắt buộc')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .notOneOf([yup.ref('currentPassword')], 'Mật khẩu mới không được trùng với mật khẩu cũ'),
    confirmPassword: yup
      .string()
      .required('Xác nhận mật khẩu là bắt buộc')
      .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
  })
  .required();

const Settings: React.FC = () => {
  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordInputs) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      // Reset form after successful submission
      reset();

      // Show success message (you might want to implement a proper notification system)
      alert('Mật khẩu đã được thay đổi thành công');
    } catch (err: any) {
      // Error handling is already managed by RTK Query
      // console.error('Failed to change password:', err);
      console.log(err.data);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1" gutterBottom>
          Cài đặt
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Đổi mật khẩu
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {/* You might want to handle different error types differently */}
              Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Mật khẩu hiện tại"
                    type="password"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Mật khẩu mới"
                    type="password"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Xác nhận mật khẩu mới"
                    type="password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    fullWidth
                  />
                )}
              />

              <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đổi mật khẩu'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Settings;
