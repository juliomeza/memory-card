// src/components/

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ConceptCard from './ConceptCard';
import GameControls from './GameControls';
import EmptyState from './EmptyState';

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
    return <EmptyState message="No concept available. Please try a different level." />;
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
        <ConceptCard 
          concept={currentConcept.concept} 
          explanation={currentConcept.explanation}
          isFlipped={isFlipped}
          onFlip={onFlip}
        />
      </Box>
      <GameControls 
        onThumbUp={() => handleScoreUpdate(true)}
        onThumbDown={() => handleScoreUpdate(false)}
        isButtonDisabled={isButtonDisabled}
        current={hasStartedCounting ? localCurrentIndex : 0}
        total={totalConcepts}
        thumbUpColor={thumbUpColor}
        thumbDownColor={thumbDownColor}
      />
    </Box>
  );
};

export default MemoryCardGame;