// src/hooks/

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getUserProgress } from './userProgressManager';
import { getPriority } from './spacedRepetition';

export const getConceptsForReview = async (userId, level) => {
  try {
    const userProgress = await getUserProgress(userId);
    const conceptsRef = collection(db, 'concepts');
    const conceptsQuery = query(
      conceptsRef, 
      where("level", ">=", level),
      where("level", "<", level + 1000)
    );

    const conceptsSnapshot = await getDocs(conceptsQuery);
    const allConcepts = conceptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const conceptsForReview = allConcepts.filter(concept => {
      const progress = userProgress.conceptProgress[concept.id];
      return !progress || !progress.nextReview || new Date(progress.nextReview.toDate()) <= new Date();
    });

    // Sort concepts by priority
    conceptsForReview.sort((a, b) => {
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

    return conceptsForReview;
  } catch (error) {
    console.error("Error getting concepts for review:", error);
    throw error;
  }
};