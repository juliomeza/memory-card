import React, { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Box, Snackbar, Typography } from '@mui/material';
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
  const [hasVoted, setHasVoted] = useState(false);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [conceptFilter, setConceptFilter] = useState('all');
  const [userProgress, setUserProgress] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

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
          // Si no hay usuario, iniciar sesión anónimamente
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

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (!hasVoted && user) {
      try {
        await updateUserProgress(user.uid, concepts[currentConceptIndex].id, remembered);
        const updatedProgress = await getUserProgress(user.uid);
        setUserProgress(updatedProgress);
        setHasVoted(true);
        setTimeout(() => {
          setCurrentConceptIndex((prevIndex) => (prevIndex + 1) % concepts.length);
          setIsFlipped(false);
          setHasVoted(false);
        }, 500);
      } catch (error) {
        console.error("Error updating score:", error);
        setSnackbarMessage('Failed to update score. Please try again.');
        setSnackbarOpen(true);
      }
    }
  }, [user, hasVoted, concepts, currentConceptIndex]);

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
      setCurrentConceptIndex(0);
    }
  };

  if (isAuthLoading) {
    return (
      <ThemeProvider theme={appTheme}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

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
                ) : concepts.length > 0 ? (
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