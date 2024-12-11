import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useAuth } from 'hooks/auth/useAuth';

interface FormState {
  email: string;
  password: string;
}

interface FormError {
  message: string;
  field?: 'email' | 'password';
}

const Signin = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useAuth();

  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError({ message: 'Email là bắt buộc', field: 'email' });
      return false;
    }
    if (!formData.password) {
      setError({ message: 'Mật khẩu là bắt buộc', field: 'password' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError({ message: 'Email không hợp lệ', field: 'email' });
      return false;
    }
    return true;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const success = await handleLogin(formData);
      if (success) {
        navigate('/');
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setFormData((prev) => ({ ...prev, password: '' })); // Clear password on error
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Đăng Nhập
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Chào mừng trở lại!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
          error={error?.field === 'email'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:baseline-alternate-email" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Mật khẩu"
          autoComplete="current-password"
          fullWidth
          required
          error={error?.field === 'password'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:outline-lock" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: formData.password ? 1 : 0,
                  pointerEvents: formData.password ? 'auto' : 'none',
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ border: 'none', bgcolor: 'transparent !important' }}
                  edge="end"
                >
                  <IconifyIcon
                    icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                    color="neutral.light"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" variant="contained" size="medium" fullWidth disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <Button variant="text" size="small" fullWidth disabled={isLoading}>
          Đặt lại mật khẩu
        </Button>
      </Stack>

      <Modal open={showErrorModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '8px',
            width: '80%',
            maxWidth: 400,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: 'error.main',
              fontWeight: 'bold',
            }}
          >
            Đăng nhập không thành công
          </Typography>

          <Typography>Thông tin đăng nhập không chính xác. Vui lòng thử lại!</Typography>

          <Button
            variant="text"
            onClick={handleCloseModal}
            size="medium"
            sx={{
              display: 'block',
              margin: 'auto',
              width: '100%',
              textAlign: 'center',
              color: 'primary.main',
              fontWeight: 'bold',
              fontSize: 16,
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            Đồng Ý
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Signin;
