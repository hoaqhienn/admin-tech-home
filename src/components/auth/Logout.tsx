import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuth } from 'hooks/auth/useAuth';
import { LogOut } from 'lucide-react';
import ConfirmDialog from 'components/dialog/ConfirmDialog';

const LogoutComponent = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const { handleLogout } = useAuth();

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
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
        startIcon={<LogOut />}
        onClick={handleLogoutClick}
      >
        Đăng xuất
      </Button>

      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
      />
    </>
  );
};

export default LogoutComponent;
