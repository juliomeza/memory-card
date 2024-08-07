import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const ProgressBar = ({ currentIndex, totalConcepts }) => {
  const theme = useTheme();
  const progress = ((currentIndex + 1) / totalConcepts) * 100;

  return (
    <Box sx={{ position: 'relative', height: '24px', backgroundColor: theme.palette.background.paper, borderRadius: '12px', overflow: 'hidden', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: theme.palette.text.primary,
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
          color: theme.palette.text.primary,
          zIndex: 1,
          mixBlendMode: 'difference', // Esto asegura que el texto sea visible tanto en la parte llena como en la vacía de la barra
        }}
      >
        {`${currentIndex + 1}/${totalConcepts}`}
      </Typography>
    </Box>
  );
};

export default ProgressBar;