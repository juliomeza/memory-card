import React from 'react';
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const ThumbButton = ({ direction, onClick, disabled, color }) => {
  const Icon = direction === 'up' ? ThumbUpIcon : ThumbDownIcon;

  return (
    <IconButton 
      onClick={onClick}
      disabled={disabled}
      sx={{ 
        fontSize: '2rem',
        color: color,
        '&:hover': {
          backgroundColor: `${color}20`,
        },
        '&.Mui-disabled': {
          color: `${color}50`,
        },
      }}
    >
      <Icon fontSize="inherit" />
    </IconButton>
  );
};

export default ThumbButton;