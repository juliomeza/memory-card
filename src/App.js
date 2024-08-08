import React, { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Box, Snackbar, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { auth } from './services/firebase';
import { initializeUserProgress, updateUserProgress, getUserProgress } from './services/userProgressManager';
import Header from './components/Header';
import MemoryCardGame from './components/MemoryCardGame';
import ConceptFilter from './components/ConceptFilter';
import { useConcepts } from './hooks/useConcepts';
import appTheme from './styles/appTheme';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [conceptFilter, setConceptFilter] = useState('all');
  const [userProgress, setUserProgress] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [level, setLevel] = useState(1000);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [groupResponses, setGroupResponses] = useState(Array(5).fill(false));
  const [showGroupSummary, setShowGroupSummary] = useState(false);

  const { concepts, isLoading, error } = useConcepts(user, conceptFilter, level);

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
      setIsAuthLoading(true);
      setAuthError(null);
      try {
        if (currentUser) {
          setUser(currentUser);
          setIsAnonymous(currentUser.isAnonymous);
          await initializeUserProgress(currentUser.uid);
          const progress = await getUserProgress(currentUser.uid);
          setUserProgress(progress);
        } else {
          const anonymousUser = await signInAnonymously(auth);
          setUser(anonymousUser.user);
          setIsAnonymous(true);
          await initializeUserProgress(anonymousUser.user.uid);
          const progress = await getUserProgress(anonymousUser.user.uid);
          setUserProgress(progress);
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        setAuthError("An error occurred while authenticating. Please try again.");
      } finally {
        setIsAuthLoading(false);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (concepts.length > 0) {
      setCurrentGroup(concepts.slice(groupIndex * 5, (groupIndex + 1) * 5));
      setGroupResponses(Array(5).fill(false));
      setCurrentConceptIndex(0);
    }
  }, [concepts, groupIndex]);

  const handleNextGroup = useCallback(() => {
    if ((groupIndex + 1) * 5 < concepts.length) {
      setGroupIndex(groupIndex + 1);
      setCurrentConceptIndex(0);
      setGroupResponses(Array(5).fill(false));
      setShowGroupSummary(false);
    } else {
      setSnackbarMessage('You have completed all concepts in this level!');
      setSnackbarOpen(true);
    }
  }, [groupIndex, concepts.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (user) {
      try {
        await updateUserProgress(user.uid, currentGroup[currentConceptIndex].id, remembered);
        const updatedProgress = await getUserProgress(user.uid);
        setUserProgress(updatedProgress);
        
        const newGroupResponses = [...groupResponses];
        newGroupResponses[currentConceptIndex] = remembered;
        setGroupResponses(newGroupResponses);
        
        if (newGroupResponses.every(Boolean)) {
          setShowGroupSummary(true);
        } else {
          // Encontrar la siguiente flashcard incorrecta
          const nextIncorrectIndex = newGroupResponses.findIndex((response, index) => !response && index > currentConceptIndex);
          if (nextIncorrectIndex !== -1) {
            setCurrentConceptIndex(nextIncorrectIndex);
          } else {
            // Si no hay más incorrectas después de la actual, volver al principio
            setCurrentConceptIndex(newGroupResponses.findIndex(response => !response));
          }
        }
        
        setIsFlipped(false);
      } catch (error) {
        console.error("Error updating score:", error);
        setSnackbarMessage('Failed to update score. Please try again.');
        setSnackbarOpen(true);
      }
    }
  }, [user, currentGroup, currentConceptIndex, groupResponses]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setSnackbarMessage('You have been signed out successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error signing out:", error);
      setSnackbarMessage('Failed to sign out. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  const handleConceptFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setConceptFilter(newFilter);
      setGroupIndex(0);
      setCurrentConceptIndex(0);
      setGroupResponses(Array(5).fill(false));
      setShowGroupSummary(false);
    }
  };

  const GroupSummary = () => (
    <Box textAlign="center" my={4}>
      <Typography variant="h6">Group Complete!</Typography>
      <Typography>
        Correct: 5 / 5
      </Typography>
      <Button variant="contained" onClick={handleNextGroup} sx={{ mt: 2 }}>
        Next Group
      </Button>
    </Box>
  );

  if (isAuthLoading) {
    return (
      <ThemeProvider theme={appTheme}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  const correctCount = groupResponses.filter(Boolean).length;

  return (
    <GoogleOAuthProvider clientId="415342274871-60o0kom8akiemvbaberut99auqsq9fhj.apps.googleusercontent.com">
      <ThemeProvider theme={appTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
          <Header user={user} onSignOut={handleSignOut} isAnonymous={isAnonymous} />
          <Container maxWidth="sm" sx={{ mt: 4 }}>
            {authError ? (
              <Typography variant="h6" color="error" align="center" my={4}>
                {authError}
              </Typography>
            ) : (
              <>
                <ConceptFilter
                  conceptFilter={conceptFilter}
                  onConceptFilterChange={handleConceptFilterChange}
                />
                {isLoading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography variant="h6" color="error" align="center" my={4}>
                    {error}
                  </Typography>
                ) : showGroupSummary ? (
                  <GroupSummary />
                ) : currentGroup.length > 0 ? (
                  <MemoryCardGame 
                    currentConcept={currentGroup[currentConceptIndex]}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    hasVoted={false}
                    onScoreUpdate={handleScoreUpdate}
                    currentIndex={correctCount > 0 ? correctCount - 1 : 0}
                    totalConcepts={5}
                    remainingIncorrect={5 - correctCount}
                  />
                ) : (
                  <Typography variant="h6" align="center" my={4}>
                    No concepts available for the selected filter and level.
                  </Typography>
                )}
              </>
            )}
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMessage}
            />
          </Container>
        </Box>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;