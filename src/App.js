import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, CircularProgress, Box, Select, MenuItem, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import MemoryCardGame from './components/MemoryCardGame';
import GroupSummary from './components/GroupSummary';
import EmptyState from './components/EmptyState';
import appTheme from './styles/appTheme';
import { initializeAuth, signOutUser } from './redux/slices/authSlice';
import { initializeGame, setLevel, updateScore, nextGroup, clearError } from './redux/slices/gameSlice';
import { 
  selectUser, 
  selectIsAnonymous, 
  selectIsAuthLoading, 
  selectAuthError,
  selectGameData
} from './redux/selectors';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAnonymous = useSelector(selectIsAnonymous);
  const isAuthLoading = useSelector(selectIsAuthLoading);
  const authError = useSelector(selectAuthError);
  const gameData = useSelector(selectGameData);

  const { 
    level, 
    currentGroup, 
    showGroupSummary, 
    correctCount, 
    remainingConcepts, 
    hasStartedCounting,
    progressCount,
    starColorIndex,
    isLoading: isGameLoading,
    levelProgress,
    error: gameError
  } = gameData;

  useEffect(() => {
    if (!user) {
      dispatch(initializeAuth());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && (!remainingConcepts || remainingConcepts.length === 0) && !showGroupSummary) {
      dispatch(initializeGame({ userId: user.uid, level }));
    }
  }, [dispatch, user, level, remainingConcepts, showGroupSummary]);

  const handleSignOut = () => {
    dispatch(signOutUser());
  };

  const handleLevelChange = (event) => {
    const newLevel = event.target.value;
    dispatch(setLevel(newLevel));
    dispatch(initializeGame({ userId: user?.uid, level: newLevel }));
  };

  const handleScoreUpdate = (remembered) => {
    if (remainingConcepts.length > 0) {
      dispatch(updateScore({ 
        userId: user?.uid, 
        conceptId: remainingConcepts[0].id, 
        isCorrect: remembered 
      }));
    }
  };

  const handleNextGroup = () => {
    dispatch(nextGroup({ userId: user?.uid, level }));
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(clearError());
  };

  if (isAuthLoading || isGameLoading) {
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
              <EmptyState message={authError} />
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
                {showGroupSummary ? (
                  <GroupSummary 
                    correctCount={correctCount}
                    totalCount={currentGroup.length}
                    starColorIndex={starColorIndex}
                    onNextGroup={handleNextGroup}
                  />
                ) : remainingConcepts && remainingConcepts.length > 0 ? (
                  <MemoryCardGame 
                    currentConcept={remainingConcepts[0]}
                    onScoreUpdate={handleScoreUpdate}
                    currentIndex={progressCount}
                    totalConcepts={5}
                    hasStartedCounting={hasStartedCounting}
                  />
                ) : (
                  <EmptyState message="No concepts available for review at this time." />
                )}
              </>
            )}
          </Container>
          <Snackbar
            open={!!gameError}
            autoHideDuration={6000}
            onClose={handleCloseError}
            message={gameError}
          />
        </Box>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;