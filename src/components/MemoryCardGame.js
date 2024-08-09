import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MemoryCard from './MemoryCard';
import ProgressCircle from './ProgressCircle';

const MemoryCardGame = ({
  currentConcept,
  isFlipped,
  onFlip,
  onScoreUpdate,
  currentIndex,
  totalConcepts,
  hasStartedCounting,
}) => {
  const [localCurrentIndex, setLocalCurrentIndex] = useState(currentIndex);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    setLocalCurrentIndex(currentIndex);
  }, [currentIndex]);

  if (!currentConcept) {
    return (
      <Typography variant="h6" align="center" my={4}>
        No concept available. Please try a different level.
      </Typography>
    );
  }

  const thumbUpColor = '#8B5CF6';
  const thumbDownColor = '#4A90E2';

  const handleScoreUpdate = async (remembered) => {
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    
    if (remembered && localCurrentIndex < totalConcepts) {
      setLocalCurrentIndex(prev => Math.min(prev + 1, totalConcepts));
    }
    
    await onScoreUpdate(remembered);
    
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 300);
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
            onClick={() => handleScoreUpdate(true)} 
            aria-label="Remembered"
            disabled={isButtonDisabled}
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
            current={hasStartedCounting ? localCurrentIndex : 0} 
            total={totalConcepts} 
          />
        </Box>
        <Box width="33%" display="flex" justifyContent="flex-end">
          <IconButton 
            onClick={() => handleScoreUpdate(false)} 
            aria-label="Didn't remember"
            disabled={isButtonDisabled}
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
    </Box>
  );
};

export default MemoryCardGame;