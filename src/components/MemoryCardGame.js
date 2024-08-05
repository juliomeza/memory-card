import React from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MemoryCard from './MemoryCard';
import ScoreDisplay from './ScoreDisplay';
import ProgressBar from './ProgressBar';

const MemoryCardGame = ({
  currentConcept,
  isFlipped,
  onFlip,
  performance,
  hasVoted,
  onScoreUpdate,
  score,
  totalAttempts,
  currentIndex,
  totalConcepts,
  onNextCard,
  onShuffleCards
}) => {
  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" my={4}>
        <MemoryCard 
          concept={currentConcept.concept} 
          explanation={currentConcept.explanation}
          isFlipped={isFlipped}
          onFlip={onFlip}
          performance={performance}
        />
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
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
      </Box>
      <ScoreDisplay score={score} totalAttempts={totalAttempts} />
      <ProgressBar currentIndex={currentIndex} totalConcepts={totalConcepts} />
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={onNextCard}>
          Next Card
        </Button>
        <Button variant="contained" color="secondary" onClick={onShuffleCards}>
          Shuffle Cards
        </Button>
      </Box>
    </>
  );
};

export default MemoryCardGame;