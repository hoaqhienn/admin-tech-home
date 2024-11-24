import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ConfirmationDialog from 'components/dialog/ConfirmationDialog';
import IconifyIcon from 'components/base/IconifyIcon';

const LogoutComponent = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('_token');
    navigate('/auth/signin');
    setOpenDialog(false);
  };

  return (
    <>
      <Button
        sx={{
          color: 'error.main',
        }}
        variant="text"
        startIcon={<IconifyIcon icon="ic:baseline-logout" />}
        onClick={handleLogoutClick}
      >
        Logout
      </Button>

      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default LogoutComponent;
