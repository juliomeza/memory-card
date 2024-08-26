import React, { useState } from 'react';
import { Container, CircularProgress, Box, Snackbar, Select, MenuItem } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import MemoryCardGame from './components/MemoryCardGame';
import GroupSummary from './components/GroupSummary';
import EmptyState from './components/EmptyState';
import { useAuth } from './hooks/useAuth';
import { useGameLogic } from './hooks/useGameLogic';
import appTheme from './styles/appTheme';

const App = () => {
  const [level, setLevel] = useState(1000);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const { user, isAnonymous, isAuthLoading, authError, handleSignOut } = useAuth();
  const { 
    currentGroup, 
    showGroupSummary, 
    correctCount, 
    remainingConcepts, 
    hasStartedCounting,
    progressCount,
    starColorIndex,
    levelProgress,
    handleNextGroup,
    handleScoreUpdate
  } = useGameLogic(user, level);

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
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
                ) : remainingConcepts.length > 0 ? (
                  <MemoryCardGame 
                    currentConcept={remainingConcepts[0]}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    onScoreUpdate={handleScoreUpdate}
                    currentIndex={progressCount}
                    totalConcepts={currentGroup.length}
                    hasStartedCounting={hasStartedCounting}
                  />
                ) : (
                  <EmptyState message="No concepts available for review at this time." />
                )}
              </>
            )}
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
            />
          </Container>
        </Box>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;