import React from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MemoryCard from './MemoryCard';
import ProgressCircle from './ProgressCircle';

const MemoryCardGame = ({
  currentConcept,
  isFlipped,
  onFlip,
  hasVoted,
  onScoreUpdate,
  currentIndex,
  totalConcepts
}) => {
  const thumbUpColor = '#8B5CF6';
  const thumbDownColor = '#4A90E2';

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box my={2} width="100%" maxWidth="300px"> {/* Ajusta el maxWidth según el tamaño de tu flashcard */}
        <MemoryCard 
          concept={currentConcept.concept} 
          explanation={currentConcept.explanation}
          isFlipped={isFlipped}
          onFlip={onFlip}
        />
      </Box>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        width="100%" 
        maxWidth="300px" 
        mt={2} 
        mb={2}
        px={1} // Añadimos un poco de padding horizontal
      >
        <Box width="33%" display="flex" justifyContent="flex-start">
          <IconButton 
            onClick={() => onScoreUpdate(true)} 
            aria-label="Remembered"
            disabled={hasVoted}
            sx={{ 
              fontSize: '2rem',
              color: thumbUpColor,
              '&:hover': {
                backgroundColor: `${thumbUpColor}20`,
              },
            }}
          >
            <ThumbUpIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box width="33%" display="flex" justifyContent="center">
          <ProgressCircle current={currentIndex} total={totalConcepts} />
        </Box>
        <Box width="33%" display="flex" justifyContent="flex-end">
          <IconButton 
            onClick={() => onScoreUpdate(false)} 
            aria-label="Didn't remember"
            disabled={hasVoted}
            sx={{ 
              fontSize: '2rem',
              color: thumbDownColor,
              '&:hover': {
                backgroundColor: `${thumbDownColor}20`,
              },
            }}
          >
            <ThumbDownIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MemoryCardGame;