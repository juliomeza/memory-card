import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import MemoryCard from './components/MemoryCard';
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

  useEffect(() => {
    setConcepts(shuffleArray(conceptsData.concepts));
  }, []);

  const handleNextCard = () => {
    setCurrentConceptIndex((prevIndex) => 
      (prevIndex + 1) % concepts.length
    );
    setIsFlipped(false); // Reset the flip state when moving to next card
  };

  const handleShuffleCards = () => {
    setConcepts(shuffleArray([...concepts]));
    setCurrentConceptIndex(0);
    setIsFlipped(false); // Reset the flip state when shuffling
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Memory Card App
      </Typography>
      
      {concepts.length > 0 && (
        <Box display="flex" justifyContent="center" my={4}>
          <MemoryCard 
            concept={concepts[currentConceptIndex].concept} 
            explanation={concepts[currentConceptIndex].explanation}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        </Box>
      )}
      
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleNextCard}>
          Next Card
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleShuffleCards}>
          Shuffle Cards
        </Button>
      </Box>
    </Container>
  );
};

export default App;