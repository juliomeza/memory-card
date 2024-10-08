// src/services/

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getUserProgress } from './userProgressManager';
import { getPriority } from './spacedRepetition';

export const getConceptsForReview = async (userId, category) => {
  try {
    if (!userId) {
      console.log('No user ID provided, returning all concepts for the category');
      const conceptsRef = collection(db, 'concepts');
      const conceptsQuery = query(
        conceptsRef, 
        where("group", "==", category) // Filtrar por 'group' en lugar de 'level'
      );
      const conceptsSnapshot = await getDocs(conceptsQuery);
      return conceptsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    const userProgress = await getUserProgress(userId);
    const conceptsRef = collection(db, 'concepts');
    const conceptsQuery = query(
      conceptsRef, 
      where("group", "==", category) // Filtrar por 'group' en lugar de 'level'
    );

    const conceptsSnapshot = await getDocs(conceptsQuery);
    const allConcepts = conceptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (!userProgress || !userProgress.conceptProgress) {
      console.log('No user progress found, returning all concepts');
      return allConcepts;
    }

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
    return []; // Return an empty array instead of throwing an error
  }
};

export const getAllCategories = async () => {
  try {
    const conceptsRef = collection(db, 'concepts');
    const conceptsSnapshot = await getDocs(conceptsRef);
    const categories = new Set();
    conceptsSnapshot.docs.forEach(doc => {
      categories.add(doc.data().group);
    });
    return Array.from(categories).sort((a, b) => {
      const aNum = parseInt(a.split('|')[0]);
      const bNum = parseInt(b.split('|')[0]);
      return aNum - bNum;
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};