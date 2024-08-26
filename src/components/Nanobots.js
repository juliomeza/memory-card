// src/components/

import React from 'react';
import { Box } from '@mui/material';

const Nanobots = ({ count }) => {
  const maxHeight = 10; // Altura máxima de la figura
  const width = 5; // Ancho de la figura

  const getColor = (index) => {
    const colors = ['#CD7F32', '#C0C0C0', '#FFD700', '#0F52BA', '#878681'];
    return colors[index % colors.length];
  };

  const renderNanobot = (x, y, index) => (
    <Box
      key={`nanobot-${x}-${y}`}
      sx={{
        position: 'absolute',
        left: `${x * 10}px`,
        bottom: `${y * 10}px`,
        width: 8,
        height: 8,
        bgcolor: getColor(index),
        borderRadius: '50%',
      }}
    />
  );

  const renderFigure = () => {
    const nanobots = [];
    let index = 0;

    // Cuerpo
    for (let y = 0; y < Math.min(count, maxHeight); y++) {
      for (let x = 0; x < width; x++) {
        nanobots.push(renderNanobot(x, y, index++));
      }
    }

    // Brazos
    if (count > maxHeight * width) {
      const armsStart = Math.min(maxHeight, Math.floor(count / width)) - 3;
      for (let y = armsStart; y < armsStart + 3; y++) {
        nanobots.push(renderNanobot(-1, y, index++));
        nanobots.push(renderNanobot(width, y, index++));
      }
    }

    // Cabeza
    if (count > (maxHeight * width) + 6) {
      nanobots.push(renderNanobot(2, maxHeight, index++));
    }

    return nanobots;
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {renderFigure()}
    </Box>
  );
};

export default Nanobots;