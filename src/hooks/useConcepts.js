// src/hooks/

import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getUserProgress, getConceptsForReview } from '../services/userProgressManager';
import { getPriority } from '../services/spacedRepetition';

export const useConcepts = (user, level) => {
  const [concepts, setConcepts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConcepts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const conceptsRef = collection(db, 'concepts');
      let conceptsQuery;

      if (level) {
        conceptsQuery = query(
          conceptsRef, 
          where("level", ">=", level),
          where("level", "<", level + 1000)
        );
      } else {
        conceptsQuery = conceptsRef; // If no level is specified, get all concepts
      }

      let conceptsData = [];

      if (user) {
        const userProgress = await getUserProgress(user.uid);
        const allConceptsSnapshot = await getDocs(conceptsQuery);
        const allConcepts = allConceptsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        conceptsData = getConceptsForReview(userProgress, allConcepts);

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
        conceptsData = conceptsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      setConcepts(conceptsData);
    } catch (error) {
      console.error("Error loading concepts from Firestore:", error);
      setError('Failed to load concepts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user, level]);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  return { concepts, isLoading, error, loadConcepts };
};