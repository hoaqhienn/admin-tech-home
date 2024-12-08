import { useState, ChangeEvent, FormEvent } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
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
} from '@mui/material';

interface User {
  [key: string]: string;
}

const Signin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!user.email || !user.password) {
        throw new Error('Please fill in all required fields.');
      }
      if (await handleLogin({ email: user.email, password: user.password })) {
        navigate('/');
      } else {
        throw new Error('Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Đăng Nhập
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Chào mừng trở lại!
      </Typography>

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
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
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Mật khẩu"
          autoComplete="current-password"
          fullWidth
          required
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
                  opacity: user.password ? 1 : 0,
                  pointerEvents: user.password ? 'auto' : 'none',
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

        <Button type="submit" variant="contained" size="medium" fullWidth>
          Đăng nhập
        </Button>
        <Button variant="text" size="small" fullWidth>
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
              // position center
              display: 'block',
              margin: 'auto',
              width: '100%',
              // center text
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
