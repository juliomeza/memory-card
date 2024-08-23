// src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';
import { initializeUserProgress, getUserProgress } from '../services/userProgressManager';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsAuthLoading(true);
      setAuthError(null);
      try {
        if (currentUser) {
          setUser(currentUser);
          setIsAnonymous(currentUser.isAnonymous);
          await initializeUserProgress(currentUser.uid);
        } else {
          const anonymousUser = await signInAnonymously(auth);
          setUser(anonymousUser.user);
          setIsAnonymous(true);
          await initializeUserProgress(anonymousUser.user.uid);
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        setAuthError("An error occurred while authenticating. Please try again.");
      } finally {
        setIsAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setAuthError('Failed to sign out. Please try again.');
    }
  };

  return { user, isAnonymous, isAuthLoading, authError, handleSignOut };
};