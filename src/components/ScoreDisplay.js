import React from 'react';
import { Box, Typography } from '@mui/material';

const ScoreDisplay = ({ score, totalAttempts }) => {
  const percentage = totalAttempts > 0 ? (score / totalAttempts * 100).toFixed(2) : 0;

  return (
    <Box textAlign="center" mt={2}>
      <Typography variant="h6">
        Puntuación: {score} / {totalAttempts}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Porcentaje de aciertos: {percentage}%
      </Typography>
    </Box>
  );
};

export default ScoreDisplay;