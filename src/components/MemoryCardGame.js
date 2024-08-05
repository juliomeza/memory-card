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
          color="success" 
          onClick={() => onScoreUpdate(true)} 
          aria-label="Remembered"
          disabled={hasVoted}
          sx={{ fontSize: '2rem' }}
        >
          <ThumbUpIcon fontSize="inherit" />
        </IconButton>
        <IconButton 
          color="error" 
          onClick={() => onScoreUpdate(false)} 
          aria-label="Didn't remember"
          disabled={hasVoted}
          sx={{ fontSize: '2rem' }}
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