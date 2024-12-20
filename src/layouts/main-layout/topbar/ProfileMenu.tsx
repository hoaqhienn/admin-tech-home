import { useState } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/auth/useAuth';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import {
  ButtonBase,
  Avatar,
  MenuItem,
  Stack,
  Typography,
  Divider,
  ListItemIcon,
  Menu,
  Box,
} from '@mui/material';

interface MenuItems {
  id: number;
  key: string;
  title: string;
  icon: string;
}

const menuItems: MenuItems[] = [
  {
    id: 1,
    key: 'view-profile',
    title: 'View Profile',
    icon: 'ic:outline-account-circle',
  },
  {
    id: 2,
    key: 'edit-profile',
    title: 'Account Settings',
    icon: 'ic:outline-manage-accounts',
  },
  {
    id: 3,
    key: 'notifications',
    title: 'Notifications',
    icon: 'ic:outline-notifications-none',
  },
  {
    id: 4,
    key: 'switch-account',
    title: 'Switch Account',
    icon: 'ic:outline-switch-account',
  },
  {
    id: 5,
    key: 'help-center',
    title: 'Help Center',
    icon: 'ic:outline-contact-support',
  },
  {
    id: 6,
    key: 'logout',
    title: 'Đăng xuất',
    icon: 'ic:baseline-logout',
  },
];

const ProfileMenu = () => {
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const nav = useNavigate();
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: MenuItems) => {
    if (item.key === 'logout') {
      handleClickOpen();
    }
    handleProfileMenuClose();
  };

  const handleConfirm = () => {
    localStorage.removeItem('_token');
    nav('/auth/signin');
  };

  return (
    <>
      <ConfirmDialog
        open={openDialog}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Đăng xuất"
        message="Xác nhận đăng xuất?"
      />
      <ButtonBase
        sx={{ ml: 1 }}
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          src={user?.user.avatar}
          sx={{
            height: 44,
            width: 44,
            bgcolor: 'primary.main',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: 230,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem onClick={handleProfileMenuClose} sx={{ '&:hover': { bgcolor: 'info.dark' } }}>
            <Avatar src={user?.user.avatar} sx={{ mr: 1, height: 42, width: 42 }} />
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {user?.user.fullname}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                {user?.user.email}
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {menuItems.map((item) => {
            return (
              <MenuItem
                key={item.id}
                onClick={() => {
                  handleMenuItemClick(item);
                }}
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                  <IconifyIcon icon={item.icon} />
                </ListItemIcon>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {item.title}
                </Typography>
              </MenuItem>
            );
          })}
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
