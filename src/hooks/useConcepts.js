import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getUserProgress, getConceptsForReview } from '../services/userProgressManager';
import { getPriority } from '../services/spacedRepetition';

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

        const conceptsForReview = getConceptsForReview(userProgress, allConcepts);

        switch (conceptFilter) {
          case 'new':
            conceptsData = conceptsForReview.filter(concept => 
              !userProgress.conceptProgress[concept.id] || 
              userProgress.conceptProgress[concept.id].totalAttempts === 0
            );
            break;
          case 'review':
            conceptsData = conceptsForReview.filter(concept => 
              userProgress.conceptProgress[concept.id] && 
              userProgress.conceptProgress[concept.id].totalAttempts > 0
            );
            break;
          case 'all':
          default:
            conceptsData = conceptsForReview;
            break;
        }

        // Sort concepts by priority
        conceptsData.sort((a, b) => {
          const priorityA = getPriority(
            userProgress.conceptProgress[a.id]?.lastAttempt,
            userProgress.conceptProgress[a.id]?.nextReview
          );
          const priorityB = getPriority(
            userProgress.conceptProgress[b.id]?.lastAttempt,
            userProgress.conceptProgress[b.id]?.nextReview
          );
          return priorityB - priorityA;
        });
      } else {
        const conceptsSnapshot = await getDocs(conceptsQuery);
        conceptsData = shuffleArray(conceptsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
      
      setConcepts(conceptsData);
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