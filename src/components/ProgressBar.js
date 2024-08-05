import React from 'react';
import { Box, Typography } from '@mui/material';

const ProgressBar = ({ currentIndex, totalConcepts }) => {
  const progress = ((currentIndex + 1) / totalConcepts) * 100;

  return (
    <Box sx={{ position: 'relative', height: '24px', backgroundColor: '#e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#2196f3',
          transition: 'width 0.5s ease',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'text.primary',
          zIndex: 1,
        }}
      >
        {`${currentIndex + 1}/${totalConcepts}`}
      </Typography>
    </Box>
  );
};

export default ProgressBar;