import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  perspective: '1000px',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '& > div': {
    transition: 'transform 0.6s, box-shadow 0.6s',
    transformStyle: 'preserve-3d',
    position: 'relative',
    width: '100%',
    height: '100%',
  }
}));

const CardFace = styled(CardContent)(({ theme, isfront }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: '12px', // Aumentado para mayor suavidad
  transition: 'box-shadow 0.6s',
  transform: isfront ? 'rotateY(0deg)' : 'rotateY(180deg)',
  boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.15)', // Sombra pronunciada
}));

const MemoryCard = ({ concept, explanation, isFlipped, onFlip }) => {
  return (
    <Box sx={{ 
      width: 300,
      height: 200,
      backgroundColor: 'background.default',
      borderRadius: '12px', // Aumentado para coincidir con CardFace
      overflow: 'hidden',
    }}>
      <StyledCard onClick={onFlip}>
        <Box sx={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          <CardFace isfront="true">
            <Typography variant="h5" fontWeight="bold">{concept}</Typography>
          </CardFace>
          <CardFace>
            <Typography variant="body1">{explanation}</Typography>
          </CardFace>
        </Box>
      </StyledCard>
    </Box>
  );
};

export default MemoryCard;