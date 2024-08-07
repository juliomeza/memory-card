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
  backgroundColor: isfront ? theme.palette.primary.light : theme.palette.secondary.light,
  color: isfront ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
  borderRadius: '4px', // Esquinas muy sutilmente redondeadas
  transition: 'box-shadow 0.6s',
  transform: isfront ? 'rotateY(0deg)' : 'rotateY(180deg)',
}));

const MemoryCard = ({ concept, explanation, isFlipped, onFlip }) => {
  return (
    <Box sx={{ 
      width: 300,
      height: 200,
      backgroundColor: 'background.default',
      borderRadius: '4px', // Coincide con el borderRadius de CardFace
      overflow: 'hidden',
    }}>
      <StyledCard onClick={onFlip}>
        <Box sx={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Sombra sutil
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