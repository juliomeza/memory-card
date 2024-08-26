import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import ConceptCard from './ConceptCard';
import GameControls from './GameControls';
import EmptyState from './EmptyState';
import { updateScore } from '../redux/slices/gameSlice';
import { selectRemainingConcepts, selectCorrectCount, selectHasStartedCounting } from '../redux/selectors';

const MemoryCardGame = () => {
  const dispatch = useDispatch();
  const remainingConcepts = useSelector(selectRemainingConcepts);
  const correctCount = useSelector(selectCorrectCount);
  const hasStartedCounting = useSelector(selectHasStartedCounting);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const currentConcept = remainingConcepts[0];

  useEffect(() => {
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
    
    dispatch(updateScore({ 
      conceptId: currentConcept.id, 
      isCorrect: remembered 
    }));
    
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
        current={hasStartedCounting ? correctCount : 0}
        total={5}
        thumbUpColor={thumbUpColor}
        thumbDownColor={thumbDownColor}
      />
    </Box>
  );
};

export default MemoryCardGame;