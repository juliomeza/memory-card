import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export const initializeUserProgress = async (userId) => {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  if (!userProgressDoc.exists()) {
    await setDoc(userProgressRef, {
      totalAttempts: 0,
      correctAttempts: 0,
      conceptProgress: []
    });
  }
};

export const updateUserProgress = async (userId, conceptId, isCorrect) => {
  const userProgressRef = doc(db, 'userProgress', userId);

  await updateDoc(userProgressRef, {
    totalAttempts: increment(1),
    correctAttempts: increment(isCorrect ? 1 : 0),
    conceptProgress: arrayUnion({
      conceptId,
      timestamp: new Date(),
      isCorrect
    })
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

export const getConceptPerformance = (userProgress, conceptId) => {
  if (!userProgress || !userProgress.conceptProgress) return null;

  const conceptAttempts = userProgress.conceptProgress.filter(
    attempt => attempt.conceptId === conceptId
  );

  const totalAttempts = conceptAttempts.length;
  const correctAttempts = conceptAttempts.filter(attempt => attempt.isCorrect).length;

  return {
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0
  };
};