import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Box, Typography, AppBar, Toolbar, CircularProgress, Select, MenuItem, IconButton, Snackbar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import MemoryCard from './components/MemoryCard';
import ScoreDisplay from './components/ScoreDisplay';
import { initializeUserProgress, updateUserProgress, getUserProgress, getConceptPerformance } from './services/userProgressManager';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App = () => {
  const [concepts, setConcepts] = useState([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentConceptPerformance, setCurrentConceptPerformance] = useState(null);

  const loadGroupsAndConcepts = useCallback(async () => {
    setIsLoading(true);
    try {
      const conceptsRef = collection(db, 'concepts');
      const conceptsSnapshot = await getDocs(conceptsRef);
      const conceptsData = conceptsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const uniqueGroups = ['all', ...new Set(conceptsData.map(c => c.group))];
      setGroups(uniqueGroups);
      
      setConcepts(shuffleArray(conceptsData));
    } catch (error) {
      console.error("Error loading concepts from Firestore:", error);
      setSnackbarMessage('Failed to load concepts. Please try again later.');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterConceptsByGroup = useCallback(async (group) => {
    setIsLoading(true);
    try {
      const conceptsRef = collection(db, 'concepts');
      let querySnapshot;

      if (group === 'all') {
        querySnapshot = await getDocs(conceptsRef);
      } else {
        const q = query(conceptsRef, where("group", "==", group));
        querySnapshot = await getDocs(q);
      }

      const filteredConcepts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setConcepts(shuffleArray(filteredConcepts));
      setCurrentConceptIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Error filtering concepts:", error);
      setSnackbarMessage('Failed to filter concepts. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        loadUserProgress(currentUser.uid);
      }
    });

    loadGroupsAndConcepts();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, [loadGroupsAndConcepts]);

  const getCurrentConceptPerformance = useCallback(async () => {
    if (user && concepts.length > 0) {
      const progress = await getUserProgress(user.uid);
      const performance = getConceptPerformance(progress, concepts[currentConceptIndex].id);
      setCurrentConceptPerformance(performance);
    }
  }, [user, concepts, currentConceptIndex]);

  useEffect(() => {
    if (user && concepts.length > 0) {
      getCurrentConceptPerformance();
    }
  }, [user, concepts, currentConceptIndex, getCurrentConceptPerformance]);

  const handleGroupChange = useCallback((event) => {
    setSelectedGroup(event.target.value);
    filterConceptsByGroup(event.target.value);
  }, [filterConceptsByGroup]);

  const loadUserProgress = useCallback(async (userId) => {
    const progress = await getUserProgress(userId);
    if (progress) {
      setScore(progress.correctAttempts);
      setTotalAttempts(progress.totalAttempts);
    }
  }, []);

  const handleNextCard = useCallback(() => {
    setCurrentConceptIndex((prevIndex) => (prevIndex + 1) % concepts.length);
    setIsFlipped(false);
    setHasVoted(false);
    setCurrentConceptPerformance(null);
  }, [concepts.length]);

  const handleShuffleCards = useCallback(() => {
    setConcepts(shuffleArray([...concepts]));
    setCurrentConceptIndex(0);
    setIsFlipped(false);
  }, [concepts]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleScoreUpdate = useCallback(async (remembered) => {
    if (!hasVoted && user) {
      await updateUserProgress(user.uid, concepts[currentConceptIndex].id, remembered);
      setScore(prevScore => remembered ? prevScore + 1 : prevScore);
      setTotalAttempts(prevAttempts => prevAttempts + 1);
      setHasVoted(true);
      getCurrentConceptPerformance();
      setTimeout(handleNextCard, 500);
    }
  }, [user, hasVoted, concepts, currentConceptIndex, getCurrentConceptPerformance, handleNextCard]);

  const handleGoogleSignIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setSnackbarMessage('Failed to sign in with Google. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  const handleAnonymousSignIn = useCallback(async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error during anonymous sign in:", error);
      setSnackbarMessage('Failed to sign in anonymously. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setScore(0);
      setTotalAttempts(0);
    } catch (error) {
      console.error("Error signing out:", error);
      setSnackbarMessage('Failed to sign out. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  const getFirstName = useCallback((fullName) => {
    return fullName ? fullName.split(' ')[0] : 'Usuario';
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Memory Card
          </Typography>
          <Box sx={{ minWidth: 120, mr: 2 }}>
            <Select
              value={selectedGroup}
              onChange={handleGroupChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="" disabled>
                Group
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {user && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.isAnonymous ? "Anónimo" : getFirstName(user.displayName)}
              </Typography>
              <Button color="inherit" onClick={handleSignOut}>
                Cerrar Sesión
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {concepts.length > 0 ? (
          <>
            <Box display="flex" flexDirection="column" alignItems="center" my={4}>
              <MemoryCard 
                concept={concepts[currentConceptIndex].concept} 
                explanation={concepts[currentConceptIndex].explanation}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                performance={currentConceptPerformance}
              />
              <Box display="flex" justifyContent="center" gap={2} mt={2}>
                <IconButton 
                  color="success" 
                  onClick={() => handleScoreUpdate(true)} 
                  aria-label="Remembered"
                  disabled={hasVoted}
                  sx={{ fontSize: '2rem' }}
                >
                  <ThumbUpIcon fontSize="inherit" />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => handleScoreUpdate(false)} 
                  aria-label="Didn't remember"
                  disabled={hasVoted}
                  sx={{ fontSize: '2rem' }}
                >
                  <ThumbDownIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>
            <ScoreDisplay score={score} totalAttempts={totalAttempts} />
            <Box mt={2} mb={2} sx={{ position: 'relative', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  backgroundColor: '#2196f3',
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                  width: `${((currentConceptIndex + 1) / concepts.length) * 100}%`,
                }}
              />
            </Box>
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              <Button variant="contained" color="primary" onClick={handleNextCard}>
                Next Card
              </Button>
              <Button variant="contained" color="secondary" onClick={handleShuffleCards}>
                Shuffle Cards
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" align="center" my={4}>
            No concepts available for this group.
          </Typography>
        )}

        {!user && (
          <Box mt={4} textAlign="center">
            {!showAuthOptions ? (
              <Button variant="contained" color="primary" onClick={() => setShowAuthOptions(true)}>
                Guardar Puntajes
              </Button>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Inicia sesión para guardar tus puntajes:
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoogleSignIn} sx={{ mr: 2 }}>
                  Google
                </Button>
                <Button variant="contained" color="secondary" onClick={handleAnonymousSignIn}>
                  Anónimo
                </Button>
              </Box>
            )}
          </Box>
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