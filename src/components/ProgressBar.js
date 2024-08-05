import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const ProgressBar = ({ currentIndex, totalConcepts }) => {
  const progress = ((currentIndex + 1) / totalConcepts) * 100;

  return (
    <Box sx={{ 
      position: 'relative', 
      mt: 4, 
      mb: 2, 
      maxWidth: 300, // Ajusta este valor para que coincida con el ancho de tu tarjeta
      width: '100%',
      margin: '0 auto' // Centra el componente
    }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8, // Reducido de 10 a 8 para hacerlo un poco más delgado
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundImage: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            animation: `${pulse} 2s ease-in-out infinite`,
          },
          boxShadow: '0 2px 4px 1px rgba(255, 105, 135, .2)', // Sombra ligeramente reducida
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: -20, // Ajustado para estar más cerca de la barra
          left: `${progress}%`,
          transform: 'translateX(-50%)',
          transition: 'left 0.5s ease',
        }}
      >
        <Typography variant="caption" color="textSecondary">
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Typography variant="caption" color="textSecondary">
          {`${currentIndex + 1} / ${totalConcepts}`}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {totalConcepts} conceptos
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;