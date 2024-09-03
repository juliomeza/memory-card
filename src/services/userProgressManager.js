import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

// Initialize user progress document in Firestore
export const initializeUserProgress = async (userId) => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (!userProgressDoc.exists()) {
      await setDoc(userProgressRef, {
        totalAttempts: 0,
        correctAttempts: 0,
        conceptProgress: {},
        levelProgress: {}
      });
      console.log('User progress initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
};

// Update user progress after answering a concept
export const updateUserProgress = async (userId, conceptId, isCorrect) => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);

    const userProgressDoc = await getDoc(userProgressRef);
    if (!userProgressDoc.exists()) {
      console.error('User progress document does not exist');
      return;
    }

    const userData = userProgressDoc.data();
    
    const conceptProgress = userData.conceptProgress[conceptId] || {
      totalAttempts: 0,
      correctAttempts: 0,
      lastAttempt: null,
      nextReview: null,
      interval: 1, // initial interval in days
    };

    conceptProgress.totalAttempts++;
    if (isCorrect) {
      conceptProgress.correctAttempts++;
      conceptProgress.interval *= 2; // increase interval
    } else {
      conceptProgress.interval = 1; // reset interval
    }

    conceptProgress.lastAttempt = serverTimestamp();
    conceptProgress.nextReview = new Date(Date.now() + conceptProgress.interval * 24 * 60 * 60 * 1000);

    await updateDoc(userProgressRef, {
      totalAttempts: increment(1),
      correctAttempts: increment(isCorrect ? 1 : 0),
      [`conceptProgress.${conceptId}`]: conceptProgress
    });

    console.log('User progress updated successfully');
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Update level progress
export const updateLevelProgress = async (userId, level, completed, total) => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);
    const currentLevelProgress = userProgressDoc.data()?.levelProgress?.[level] || { completed: 0, total: 0 };

    // Solo actualiza 'completed' si es mayor que el valor actual
    const newCompleted = Math.max(currentLevelProgress.completed, completed);
    // Solo actualiza 'total' si es mayor que el valor actual y no es 0
    const newTotal = total > currentLevelProgress.total ? total : currentLevelProgress.total;

    await updateDoc(userProgressRef, {
      [`levelProgress.${level}`]: { completed: newCompleted, total: newTotal }
    });

    console.log(`Level progress updated: Level ${level}, Completed: ${newCompleted}, Total: ${newTotal}`);
    return { completed: newCompleted, total: newTotal };
  } catch (error) {
    console.error('Error updating level progress:', error);
    throw error;
  }
};

// Get user progress data
export const getUserProgress = async (userId) => {
  if (!userId) {
    console.log('No user ID provided, returning null');
    return null;
  }
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (userProgressDoc.exists()) {
      return userProgressDoc.data();
    } else {
      console.log('No user progress found for user:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

// Get level progress for a specific level
export const getLevelProgress = async (userId, level) => {
  try {
    const userProgress = await getUserProgress(userId);
    return userProgress?.levelProgress?.[level] || { completed: 0, total: 0 };
  } catch (error) {
    console.error('Error getting level progress:', error);
    throw error;
  }
};

// Get performance data for a specific concept
export const getConceptPerformance = (userProgress, conceptId) => {
  if (!userProgress || !userProgress.conceptProgress || !userProgress.conceptProgress[conceptId]) return null;

  const conceptProgress = userProgress.conceptProgress[conceptId];

  return {
    totalAttempts: conceptProgress.totalAttempts,
    correctAttempts: conceptProgress.correctAttempts,
    accuracy: conceptProgress.totalAttempts > 0 ? (conceptProgress.correctAttempts / conceptProgress.totalAttempts) * 100 : 0,
    nextReview: conceptProgress.nextReview
  };
};

// Get concepts that are due for review
export const getConceptsForReview = (userProgress, allConcepts) => {
  if (!userProgress || !userProgress.conceptProgress) return allConcepts;

  const now = new Date();
  return allConcepts.filter(concept => {
    const progress = userProgress.conceptProgress[concept.id];
    return !progress || !progress.nextReview || new Date(progress.nextReview.toDate()) <= now;
  });
};