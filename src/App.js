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
import { initializeGame, setCategory, updateScore, nextGroup, clearError, setCategories } from './redux/slices/gameSlice';
import { getAllCategories } from './services/gameService';
import { 
  selectUser, 
  selectIsAnonymous, 
  selectIsAuthLoading, 
  selectAuthError,
  selectGameData,
  selectCategories
} from './redux/selectors';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAnonymous = useSelector(selectIsAnonymous);
  const isAuthLoading = useSelector(selectIsAuthLoading);
  const authError = useSelector(selectAuthError);
  const gameData = useSelector(selectGameData);
  const categories = useSelector(selectCategories) || [];

  const { 
    category, 
    currentGroup, 
    showGroupSummary, 
    correctCount, 
    remainingConcepts, 
    hasStartedCounting,
    progressCount,
    starColorIndex,
    isLoading: isGameLoading,
    categoryProgress,
    error: gameError
  } = gameData;

  useEffect(() => {
    if (!user) {
      dispatch(initializeAuth());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && category && remainingConcepts?.length === 0 && !showGroupSummary) {
      dispatch(initializeGame({ userId: user.uid, category }));
    }
  }, [dispatch, user, category, remainingConcepts?.length, showGroupSummary]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        dispatch(setCategories(fetchedCategories));
        if (fetchedCategories.length > 0 && !category) {
          dispatch(setCategory(fetchedCategories[0]));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        dispatch(setCategories([]));
      }
    };
    fetchCategories();
  }, [dispatch, category]);

  const handleSignOut = () => {
    dispatch(signOutUser());
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    dispatch(setCategory(newCategory));
    dispatch(initializeGame({ userId: user?.uid, category: newCategory }));
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
    dispatch(nextGroup({ userId: user?.uid, category }));
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
            categoryProgress={categoryProgress}
          />
          <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
            {authError ? (
              <EmptyState message={authError} />
            ) : (
              <>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Select category' }}
                  >
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No categories available</MenuItem>
                    )}
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