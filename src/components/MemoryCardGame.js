import React, { useState, useCallback, useEffect } from 'react';
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

  const handleFlip = useCallback(() => setIsFlipped(prev => !prev), []);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    
    dispatch(updateScore({ 
      conceptId: currentConcept.id, 
      isCorrect: remembered 
    }));
    
    setTimeout(() => {
      setIsButtonDisabled(false);
      setIsFlipped(false);  // Aseguramos que la siguiente tarjeta muestre el concepto
    }, 300);
  }, [isButtonDisabled, currentConcept, dispatch]);

  const thumbUpColor = '#8B5CF6';
  const thumbDownColor = '#4A90E2';

  if (!currentConcept) {
    return <EmptyState message="No concept available. Please try a different level." />;
  }

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

export default React.memo(MemoryCardGame);