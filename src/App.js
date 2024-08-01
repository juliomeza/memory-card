import React, { useState, useEffect } from 'react';
import { Container, Button, Box, Typography, AppBar, Toolbar, LinearProgress, Select, MenuItem, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import MemoryCard from './components/MemoryCard';
import ScoreDisplay from './components/ScoreDisplay';
import conceptsData from './data/concepts.json';

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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const uniqueCategories = [...new Set(conceptsData.concepts.map(c => c.category))];
    setCategories(['all', ...uniqueCategories]);
    filterConceptsByCategory('all');

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserScore(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const filterConceptsByCategory = (category) => {
    const filteredConcepts = category === 'all' 
      ? conceptsData.concepts 
      : conceptsData.concepts.filter(c => c.category === category);
    setConcepts(shuffleArray(filteredConcepts));
    setCurrentConceptIndex(0);
    setIsFlipped(false);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterConceptsByCategory(event.target.value);
  };

  const loadUserScore = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setScore(userData.score || 0);
      setTotalAttempts(userData.totalAttempts || 0);
    }
  };

  const saveUserScore = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { score, totalAttempts }, { merge: true });
    }
  };

  const handleNextCard = () => {
    setCurrentConceptIndex((prevIndex) => (prevIndex + 1) % concepts.length);
    setIsFlipped(false);
  };

  const handleShuffleCards = () => {
    setConcepts(shuffleArray([...concepts]));
    setCurrentConceptIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleScoreUpdate = (remembered) => {
    setScore(prevScore => remembered ? prevScore + 1 : prevScore);
    setTotalAttempts(prevAttempts => prevAttempts + 1);
    saveUserScore();
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign in:", error);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error during anonymous sign in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setScore(0);
      setTotalAttempts(0);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : 'Usuario';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Memory Card
          </Typography>
          <Box sx={{ minWidth: 120, mr: 2 }}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="" disabled>
                Category
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
        {concepts.length > 0 && (
          <>
            <Box display="flex" flexDirection="column" alignItems="center" my={4}>
              <MemoryCard 
                concept={concepts[currentConceptIndex].concept} 
                explanation={concepts[currentConceptIndex].explanation}
                isFlipped={isFlipped}
                onFlip={handleFlip}
              />
              <Box display="flex" justifyContent="center" gap={2} mt={2}>
                <IconButton color="success" onClick={() => handleScoreUpdate(true)} aria-label="Remembered">
                  <ThumbUpIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleScoreUpdate(false)} aria-label="Didn't remember">
                  <ThumbDownIcon />
                </IconButton>
              </Box>
            </Box>
            <ScoreDisplay score={score} totalAttempts={totalAttempts} />
            <Box mt={2} mb={2}>
              <LinearProgress variant="determinate" value={(currentConceptIndex + 1) / concepts.length * 100} />
              <Typography variant="body2" color="text.secondary" align="center">
                {`${currentConceptIndex + 1} / ${concepts.length}`}
              </Typography>
            </Box>
          </>
        )}
        
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="contained" color="primary" onClick={handleNextCard}>
            Next Card
          </Button>
          <Button variant="contained" color="secondary" onClick={handleShuffleCards}>
            Shuffle Cards
          </Button>
        </Box>

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
      </Container>
    </>
  );
};

export default App;