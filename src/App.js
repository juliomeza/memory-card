import React, { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Box, Snackbar, Typography } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { initializeUserProgress, updateUserProgress } from './services/userProgressManager';
import Header from './components/Header';
import MemoryCardGame from './components/MemoryCardGame';
import Login from './components/Login';

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
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      }
    });

    loadGroupsAndConcepts();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, [loadGroupsAndConcepts]);

  const handleGroupChange = useCallback((event) => {
    setSelectedGroup(event.target.value);
    filterConceptsByGroup(event.target.value);
  }, [filterConceptsByGroup]);

  const handleNextCard = useCallback(() => {
    setCurrentConceptIndex((prevIndex) => (prevIndex + 1) % concepts.length);
    setIsFlipped(false);
    setHasVoted(false);
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
      setHasVoted(true);
      setTimeout(handleNextCard, 500);
    }
  }, [user, hasVoted, concepts, currentConceptIndex, handleNextCard]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setSnackbarMessage('Failed to sign out. Please try again.');
      setSnackbarOpen(true);
    }
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
      <Header 
        user={user}
        selectedGroup={selectedGroup}
        groups={groups}
        onGroupChange={handleGroupChange}
        onSignOut={handleSignOut}
      />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {user ? (
          concepts.length > 0 ? (
            <MemoryCardGame 
              currentConcept={concepts[currentConceptIndex]}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              hasVoted={hasVoted}
              onScoreUpdate={handleScoreUpdate}
              currentIndex={currentConceptIndex}
              totalConcepts={concepts.length}
              onNextCard={handleNextCard}
              onShuffleCards={handleShuffleCards}
            />
          ) : (
            <Typography variant="h6" align="center" my={4}>
              No concepts available for this group.
            </Typography>
          )
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