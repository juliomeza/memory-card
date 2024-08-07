import React from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MemoryCard from './MemoryCard';
import ProgressBar from './ProgressBar';

const MemoryCardGame = ({
  currentConcept,
  isFlipped,
  onFlip,
  hasVoted,
  onScoreUpdate,
  currentIndex,
  totalConcepts
}) => {
  // Definimos los nuevos colores para los botones
  const thumbUpColor = '#8B5CF6'; // Tono morado suave
  const thumbDownColor = '#5EEAD4'; // Verde azulado

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box my={2}>
        <MemoryCard 
          concept={currentConcept.concept} 
          explanation={currentConcept.explanation}
          isFlipped={isFlipped}
          onFlip={onFlip}
        />
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={2} mb={2}>
        <IconButton 
          onClick={() => onScoreUpdate(true)} 
          aria-label="Remembered"
          disabled={hasVoted}
          sx={{ 
            fontSize: '2rem',
            color: thumbUpColor,
            '&:hover': {
              backgroundColor: `${thumbUpColor}20`, // 20% de opacidad para el efecto hover
            },
          }}
        >
          <ThumbUpIcon fontSize="inherit" />
        </IconButton>
        <IconButton 
          onClick={() => onScoreUpdate(false)} 
          aria-label="Didn't remember"
          disabled={hasVoted}
          sx={{ 
            fontSize: '2rem',
            color: thumbDownColor,
            '&:hover': {
              backgroundColor: `${thumbDownColor}20`, // 20% de opacidad para el efecto hover
            },
          }}
        >
          <ThumbDownIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Box width="100%" mt={2}>
        <ProgressBar currentIndex={currentIndex} totalConcepts={totalConcepts} />
      </Box>
    </Box>
  );
};

export default MemoryCardGame;