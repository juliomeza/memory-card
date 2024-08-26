import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ConceptCard from './ConceptCard';
import GameControls from './GameControls';
import EmptyState from './EmptyState';

const MemoryCardGame = ({
  currentConcept,
  onScoreUpdate,
  currentIndex,
  totalConcepts,
  hasStartedCounting,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Reset isFlipped when currentConcept changes
    setIsFlipped(false);
  }, [currentConcept]);

  if (!currentConcept) {
    return <EmptyState message="No concept available. Please try a different level." />;
  }

  const thumbUpColor = '#8B5CF6';
  const thumbDownColor = '#4A90E2';

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleScoreUpdate = async (remembered) => {
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    
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
          onFlip={handleFlip}
        />
      </Box>
      <GameControls 
        onThumbUp={() => handleScoreUpdate(true)}
        onThumbDown={() => handleScoreUpdate(false)}
        isButtonDisabled={isButtonDisabled}
        current={hasStartedCounting ? currentIndex : 0}
        total={totalConcepts}
        thumbUpColor={thumbUpColor}
        thumbDownColor={thumbDownColor}
      />
    </Box>
  );
};

export default MemoryCardGame;