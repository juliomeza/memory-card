import React, { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Box, Snackbar, Typography } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { initializeUserProgress, updateUserProgress, getUserProgress } from './services/userProgressManager';
import Header from './components/Header';
import MemoryCardGame from './components/MemoryCardGame';
import Login from './components/Login';
import ConceptFilter from './components/ConceptFilter';
import { useConcepts } from './hooks/useConcepts';

const App = () => {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [conceptFilter, setConceptFilter] = useState('all');
  const [userProgress, setUserProgress] = useState(null);

  const { concepts, isLoading, error } = useConcepts(user, conceptFilter);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSnackbarMessage('You are back online');
      setSnackbarOpen(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSnackbarMessage('You are offline. Changes will be saved when you reconnect.');
      setSnackbarOpen(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await initializeUserProgress(currentUser.uid);
        const progress = await getUserProgress(currentUser.uid);
        setUserProgress(progress);
      } else {
        setUserProgress(null);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (!hasVoted && user) {
      await updateUserProgress(user.uid, concepts[currentConceptIndex].id, remembered);
      const updatedProgress = await getUserProgress(user.uid);
      setUserProgress(updatedProgress);
      setHasVoted(true);
      setTimeout(() => {
        setCurrentConceptIndex((prevIndex) => (prevIndex + 1) % concepts.length);
        setIsFlipped(false);
        setHasVoted(false);
      }, 500);
    }
  }, [user, hasVoted, concepts, currentConceptIndex]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setSnackbarMessage('Failed to sign out. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  const handleConceptFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setConceptFilter(newFilter);
      setCurrentConceptIndex(0);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header user={user} onSignOut={handleSignOut} />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {user ? (
          <>
            <ConceptFilter
              conceptFilter={conceptFilter}
              onConceptFilterChange={handleConceptFilterChange}
            />
            {concepts.length > 0 ? (
              <MemoryCardGame 
                currentConcept={concepts[currentConceptIndex]}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                hasVoted={hasVoted}
                onScoreUpdate={handleScoreUpdate}
                currentIndex={currentConceptIndex}
                totalConcepts={concepts.length}
              />
            ) : (
              <Typography variant="h6" align="center" my={4}>
                No concepts available for the selected filter.
              </Typography>
            )}
          </>
        ) : (
          <Login />
        )}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </>
  );
};

export default App;