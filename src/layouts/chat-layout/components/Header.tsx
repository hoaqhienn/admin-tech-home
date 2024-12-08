import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { Search } from 'lucide-react';

const ChatHeader: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => (
  <Box className="flex flex-row items-center space-x-1">
    <Typography variant="h4">Chats</Typography>
    <TextField
      variant="filled"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        width: 280,
        display: { xs: 'none', md: 'flex' },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

export default ChatHeader;
