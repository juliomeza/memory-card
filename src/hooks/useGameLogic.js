// src/hooks/

import { useState, useEffect, useCallback } from 'react';
import { updateUserProgress, getUserProgress, updateLevelProgress, getLevelProgress } from '../services/userProgressManager';
import { getConceptsForReview } from '../services/gameService';

export const useGameLogic = (user, level) => {
  const [concepts, setConcepts] = useState([]);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [showGroupSummary, setShowGroupSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [remainingConcepts, setRemainingConcepts] = useState([]);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [starColorIndex, setStarColorIndex] = useState(0);
  const [levelProgress, setLevelProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const loadConcepts = async () => {
      const loadedConcepts = await getConceptsForReview(user?.uid, level);
      setConcepts(loadedConcepts);
      const newGroup = loadedConcepts.slice(0, 5);
      setCurrentGroup(newGroup);
      setRemainingConcepts(newGroup);
      const totalGroups = Math.ceil(loadedConcepts.length / 5);
      if (user) {
        const progress = await getLevelProgress(user.uid, level);
        setLevelProgress({ ...progress, total: totalGroups });
      } else {
        setLevelProgress({ completed: 0, total: totalGroups });
      }
    };

    loadConcepts();
  }, [user, level]);

  const handleNextGroup = useCallback(async () => {
    const nextGroupIndex = groupIndex + 1;
    if (nextGroupIndex * 5 < concepts.length) {
      const newGroup = concepts.slice(nextGroupIndex * 5, (nextGroupIndex + 1) * 5);
      setGroupIndex(nextGroupIndex);
      setCurrentGroup(newGroup);
      setRemainingConcepts(newGroup);
      setStarColorIndex(prevIndex => (prevIndex + 1) % 5);
      setShowGroupSummary(false);
      setCorrectCount(0);
      setProgressCount(0);
      setHasStartedCounting(false);

      const newCompleted = levelProgress.completed + 1;
      setLevelProgress(prev => ({ ...prev, completed: newCompleted }));
      if (user) {
        await updateLevelProgress(user.uid, level, newCompleted, levelProgress.total);
      }
    } else {
      // Handle completion of all concepts
      console.log('All groups completed');
      // You might want to show a final summary or reset the game here
    }
  }, [groupIndex, concepts, user, level, levelProgress]);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (user && remainingConcepts[0]) {
      try {
        await updateUserProgress(user.uid, remainingConcepts[0].id, remembered);
        let newRemainingConcepts = [...remainingConcepts];
        if (remembered) {
          newRemainingConcepts.shift();
          if (!hasStartedCounting) {
            setHasStartedCounting(true);
          }
          setProgressCount(prevCount => Math.min(prevCount + 1, currentGroup.length));
          setCorrectCount(prevCount => Math.min(prevCount + 1, currentGroup.length));
        } else {
          const [incorrectConcept] = newRemainingConcepts.splice(0, 1);
          newRemainingConcepts.push(incorrectConcept);
        }
        
        setRemainingConcepts(newRemainingConcepts);
        
        if (newRemainingConcepts.length === 0) {
          setShowGroupSummary(true);
        }
      } catch (error) {
        console.error("Error updating score:", error);
        // Handle error (e.g., show a notification)
      }
    } else {
      // Si no hay usuario, simplemente actualizamos el estado local
      let newRemainingConcepts = [...remainingConcepts];
      if (remembered) {
        newRemainingConcepts.shift();
        if (!hasStartedCounting) {
          setHasStartedCounting(true);
        }
        setProgressCount(prevCount => Math.min(prevCount + 1, currentGroup.length));
        setCorrectCount(prevCount => Math.min(prevCount + 1, currentGroup.length));
      } else {
        const [incorrectConcept] = newRemainingConcepts.splice(0, 1);
        newRemainingConcepts.push(incorrectConcept);
      }
      
      setRemainingConcepts(newRemainingConcepts);
      
      if (newRemainingConcepts.length === 0) {
        setShowGroupSummary(true);
      }
    }
  }, [user, remainingConcepts, hasStartedCounting, currentGroup.length]);

  return {
    currentGroup,
    showGroupSummary,
    correctCount,
    remainingConcepts,
    hasStartedCounting,
    progressCount,
    starColorIndex,
    levelProgress,
    handleNextGroup,
    handleScoreUpdate,
  };
};