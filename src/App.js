import React, { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Box, Snackbar, Typography, Button, Select, MenuItem } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { auth } from './services/firebase';
import { initializeUserProgress, updateUserProgress, getUserProgress, updateLevelProgress, getLevelProgress } from './services/userProgressManager';
import Header from './components/Header';
import MemoryCardGame from './components/MemoryCardGame';
import RotatingStar from './components/RotatingStar';
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
  const [userProgress, setUserProgress] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [level, setLevel] = useState(1000);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [showGroupSummary, setShowGroupSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [remainingConcepts, setRemainingConcepts] = useState([]);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [starColorIndex, setStarColorIndex] = useState(0);
  const [levelProgress, setLevelProgress] = useState({ completed: 0, total: 0 });

  const { concepts, isLoading, error } = useConcepts(user, level);

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
          const levelProg = await getLevelProgress(currentUser.uid, level);
          setLevelProgress(levelProg);
        } else {
          const anonymousUser = await signInAnonymously(auth);
          setUser(anonymousUser.user);
          setIsAnonymous(true);
          await initializeUserProgress(anonymousUser.user.uid);
          const progress = await getUserProgress(anonymousUser.user.uid);
          setUserProgress(progress);
          const levelProg = await getLevelProgress(anonymousUser.user.uid, level);
          setLevelProgress(levelProg);
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
  }, [level]);

  useEffect(() => {
    if (concepts.length > 0) {
      const newGroup = concepts.slice(groupIndex * 5, (groupIndex + 1) * 5);
      setCurrentGroup(newGroup);
      setRemainingConcepts(newGroup);
      setCurrentConceptIndex(0);
      setCorrectCount(0);
      setShowGroupSummary(false);
      setHasStartedCounting(false);
      setProgressCount(0);
      const totalGroups = Math.ceil(concepts.length / 5);
      setLevelProgress(prev => ({ ...prev, total: totalGroups }));
    } else {
      setCurrentGroup([]);
      setRemainingConcepts([]);
      setCurrentConceptIndex(0);
      setCorrectCount(0);
      setShowGroupSummary(false);
      setHasStartedCounting(false);
      setProgressCount(0);
      setLevelProgress({ completed: 0, total: 0 });
    }
  }, [concepts, groupIndex]);

  const handleNextGroup = useCallback(async () => {
    if ((groupIndex + 1) * 5 < concepts.length) {
      setGroupIndex(prevIndex => prevIndex + 1);
      setStarColorIndex(prevIndex => (prevIndex + 1) % 5);
      const newCompleted = levelProgress.completed + 1;
      setLevelProgress(prev => ({ ...prev, completed: newCompleted }));
      if (user) {
        await updateLevelProgress(user.uid, level, newCompleted, levelProgress.total);
      }
    } else {
      setSnackbarMessage('You have completed all concepts in this level!');
      setSnackbarOpen(true);
      setGroupIndex(0);
      setStarColorIndex(0);
      if (user) {
        await updateLevelProgress(user.uid, level, levelProgress.total, levelProgress.total);
      }
    }
  }, [groupIndex, concepts.length, user, level, levelProgress]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (user && remainingConcepts[currentConceptIndex]) {
      try {
        await updateUserProgress(user.uid, remainingConcepts[currentConceptIndex].id, remembered);
        const updatedProgress = await getUserProgress(user.uid);
        setUserProgress(updatedProgress);
        
        let newRemainingConcepts = [...remainingConcepts];
        if (remembered) {
          newRemainingConcepts.splice(currentConceptIndex, 1);
          if (!hasStartedCounting) {
            setHasStartedCounting(true);
          }
          setProgressCount(prevCount => Math.min(prevCount + 1, currentGroup.length));
          setCorrectCount(prevCount => Math.min(prevCount + 1, currentGroup.length));
        } else {
          const [incorrectConcept] = newRemainingConcepts.splice(currentConceptIndex, 1);
          newRemainingConcepts.push(incorrectConcept);
        }
        
        setRemainingConcepts(newRemainingConcepts);
        
        if (newRemainingConcepts.length === 0) {
          setShowGroupSummary(true);
        } else {
          setCurrentConceptIndex(0);
        }
        
        setIsFlipped(false);
      } catch (error) {
        console.error("Error updating score:", error);
        setSnackbarMessage('Failed to update score. Please try again.');
        setSnackbarOpen(true);
      }
    }
  }, [user, remainingConcepts, currentConceptIndex, hasStartedCounting, currentGroup.length]);

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

  const handleLevelChange = async (event) => {
    const newLevel = event.target.value;
    setLevel(newLevel);
    resetGameState();
    if (user) {
      const progress = await getLevelProgress(user.uid, newLevel);
      setLevelProgress(progress);
    }
  };

  const resetGameState = () => {
    setGroupIndex(0);
    setCurrentConceptIndex(0);
    setShowGroupSummary(false);
    setCorrectCount(0);
    setRemainingConcepts([]);
    setIsFlipped(false);
    setHasStartedCounting(false);
    setProgressCount(0);
    setStarColorIndex(0);
  };

  const GroupSummary = () => (
    <Box textAlign="center" my={4}>
      <RotatingStar colorIndex={starColorIndex} size={60} />
      <Typography variant="h6" mt={2}>Group Complete!</Typography>
      <Typography>
        Correct: {correctCount} / {currentGroup.length}
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

  return (
    <GoogleOAuthProvider clientId="415342274871-60o0kom8akiemvbaberut99auqsq9fhj.apps.googleusercontent.com">
      <ThemeProvider theme={appTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header 
            user={user} 
            onSignOut={handleSignOut} 
            isAnonymous={isAnonymous}
            levelProgress={levelProgress}
          />
          <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
            {authError ? (
              <Typography variant="h6" color="error" align="center" my={4}>
                {authError}
              </Typography>
            ) : (
              <>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <Select
                    value={level}
                    onChange={handleLevelChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Select level' }}
                  >
                    <MenuItem value={1000}>Level 1000</MenuItem>
                    <MenuItem value={2000}>Level 2000</MenuItem>
                    <MenuItem value={3000}>Level 3000</MenuItem>
                    <MenuItem value={4000}>Level 4000</MenuItem>
                  </Select>
                </Box>
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
                ) : remainingConcepts.length > 0 ? (
                  <MemoryCardGame 
                    currentConcept={remainingConcepts[currentConceptIndex]}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    onScoreUpdate={handleScoreUpdate}
                    currentIndex={progressCount}
                    totalConcepts={currentGroup.length}
                    hasStartedCounting={hasStartedCounting}
                  />
                ) : (
                  <Typography variant="h6" align="center" my={4}>
                    No concepts available for review at this time.
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