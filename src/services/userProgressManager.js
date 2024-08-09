import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';

export const initializeUserProgress = async (userId) => {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  if (!userProgressDoc.exists()) {
    await setDoc(userProgressRef, {
      totalAttempts: 0,
      correctAttempts: 0,
      conceptProgress: {},
      levelProgress: {}
    });
  }
};

export const updateUserProgress = async (userId, conceptId, isCorrect) => {
  const userProgressRef = doc(db, 'userProgress', userId);

  const userProgressDoc = await getDoc(userProgressRef);
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
};

export const updateLevelProgress = async (userId, level, completed, total) => {
  const userProgressRef = doc(db, 'userProgress', userId);
  await updateDoc(userProgressRef, {
    [`levelProgress.${level}`]: { completed, total }
  });
};

export const getUserProgress = async (userId) => {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  if (userProgressDoc.exists()) {
    return userProgressDoc.data();
  } else {
    return null;
  }
};

export const getLevelProgress = async (userId, level) => {
  const userProgress = await getUserProgress(userId);
  return userProgress?.levelProgress?.[level] || { completed: 0, total: 0 };
};

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

export const getConceptsForReview = (userProgress, allConcepts) => {
  if (!userProgress || !userProgress.conceptProgress) return allConcepts;

  const now = new Date();
  return allConcepts.filter(concept => {
    const progress = userProgress.conceptProgress[concept.id];
    return !progress || !progress.nextReview || new Date(progress.nextReview.toDate()) <= now;
  });
};