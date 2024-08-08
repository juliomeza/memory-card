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
  hasStartedCounting,
  nextReviewDate
}) => {
  if (!currentConcept) {
    return (
      <Typography variant="h6" align="center" my={4}>
        No concept available. Please try a different filter or level.
      </Typography>
    );
  }

  const thumbUpColor = '#8B5CF6';
  const thumbDownColor = '#4A90E2';

  const formatNextReviewDate = (date) => {
    if (!date) return 'Not scheduled';
    const reviewDate = new Date(date.seconds * 1000);
    return reviewDate.toLocaleDateString();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box my={2} width="100%" maxWidth="300px">
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
        px={1}
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
              '&.Mui-disabled': {
                color: `${thumbUpColor}50`,
              },
            }}
          >
            <ThumbUpIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box width="33%" display="flex" justifyContent="center">
          <ProgressCircle 
            current={hasStartedCounting ? currentIndex : 0} 
            total={totalConcepts} 
          />
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
              '&.Mui-disabled': {
                color: `${thumbDownColor}50`,
              },
            }}
          >
            <ThumbDownIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography variant="body2" align="center">
          Next review: {formatNextReviewDate(nextReviewDate)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MemoryCardGame;