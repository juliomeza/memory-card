// src/components/

import React from 'react';
import { Typography } from '@mui/material';

const EmptyState = ({ message }) => {
  return (
    <Typography variant="h6" align="center" my={4}>
      {message}
    </Typography>
  );
};

export default EmptyState;