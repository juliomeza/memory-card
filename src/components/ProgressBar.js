import React from 'react';
import { Box } from '@mui/material';

const ProgressBar = ({ currentIndex, totalConcepts }) => {
  return (
    <Box mt={2} mb={2} sx={{ position: 'relative', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          backgroundColor: '#2196f3',
          borderRadius: '2px',
          transition: 'width 0.5s ease',
          width: `${((currentIndex + 1) / totalConcepts) * 100}%`,
        }}
      />
    </Box>
  );
};

export default ProgressBar;