import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
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
  totalConcepts,
  remainingIncorrect
}) => {
  const thumbUpColor = '#8B5CF6';
  const thumbDownColor = '#5EEAD4';

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
              backgroundColor: `${thumbUpColor}20`,
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
              backgroundColor: `${thumbDownColor}20`,
            },
          }}
        >
          <ThumbDownIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Box mt={2}>
        <ProgressCircle current={currentIndex} total={totalConcepts} />
      </Box>
      {remainingIncorrect > 0 && (
        <Typography variant="body2" mt={2}>
          Remaining incorrect: {remainingIncorrect}
        </Typography>
      )}
    </Box>
  );
};

export default MemoryCardGame;