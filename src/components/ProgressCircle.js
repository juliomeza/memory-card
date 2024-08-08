import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProgressCircle = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} size={60} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${current}/${total}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressCircle;