import { useState } from 'react';
import { Badge } from '@mui/material';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

const MessageMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    navigate('/chat');
  };

  return (
    <IconButton
      size="large"
      onClick={handleClick}
      aria-controls={open ? 'message-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      sx={{ ml: 1 }}
    >
      <Badge badgeContent={2} color="error">
        <MessageCircle />
      </Badge>
    </IconButton>
  );
};

export default MessageMenu;