import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getUserProgress } from '../services/userProgressManager';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useConcepts = (user, conceptFilter, level) => {
  const [concepts, setConcepts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConcepts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const conceptsRef = collection(db, 'concepts');
      let conceptsQuery = query(
        conceptsRef, 
        where("level", ">=", level),
        where("level", "<", level + 1000)
      );
      let conceptsData = [];

      if (user) {
        const userProgress = await getUserProgress(user.uid);
        const allConceptsSnapshot = await getDocs(conceptsQuery);
        const allConcepts = allConceptsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        switch (conceptFilter) {
          case 'new':
            const attemptedConceptIds = new Set(userProgress.conceptProgress.map(progress => progress.conceptId));
            conceptsData = allConcepts.filter(concept => !attemptedConceptIds.has(concept.id));
            break;
          case 'incorrect':
            const incorrectConceptIds = new Set(
              userProgress.conceptProgress
                .filter(progress => !progress.isCorrect)
                .map(progress => progress.conceptId)
            );
            conceptsData = allConcepts.filter(concept => incorrectConceptIds.has(concept.id));
            break;
          case 'all':
          default:
            conceptsData = allConcepts;
            break;
        }
      } else {
        const conceptsSnapshot = await getDocs(conceptsQuery);
        conceptsData = conceptsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      setConcepts(shuffleArray(conceptsData));
    } catch (error) {
      console.error("Error loading concepts from Firestore:", error);
      setError('Failed to load concepts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user, conceptFilter, level]);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  return { concepts, isLoading, error, loadConcepts };
};