import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

interface CustomSwitchProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelActive: string;
  labelInactive: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  checked,
  onChange,
  labelActive,
  labelInactive,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Switch
        checked={checked}
        onChange={onChange}
        sx={{
          width: 62,
          height: 34,
          padding: 7,
          '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
              color: '#fff',
              transform: 'translateX(22px)',
              '& + .MuiSwitch-track': {
                backgroundColor: '#4caf50', // Active color
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: '#fff',
            width: 32,
            height: 32,
          },
          '& .MuiSwitch-track': {
            borderRadius: 20 / 2,
            backgroundColor: '#bdbdbd', // Inactive color
            opacity: 1,
          },
        }}
      />
      <Typography
        sx={{
          position: 'absolute',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          color: checked ? '#4caf50' : '#bdbdbd',
          pointerEvents: 'none',
        }}
      >
        {checked ? labelActive : labelInactive}
      </Typography>
    </Box>
  );
};

export default CustomSwitch;
