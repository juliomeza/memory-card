import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, index = 0 }) => ({
  width: '100%',
  height: '200px',
  position: 'absolute',
  top: `${index * 4}px`,
  left: `${index * 2}px`,
  transform: `scale(${1 - index * 0.05})`,
  transformOrigin: 'top center',
  zIndex: 10 - index,
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: index === 0 ? 'scale(1.05)' : `scale(${1 - index * 0.05})`,
  },
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
  transform: isfront ? 'rotateY(0deg)' : 'rotateY(180deg)',
}));

const ConceptCard = ({ concept, explanation, isFlipped, onFlip }) => {
  return (
    <Box sx={{ position: 'relative', width: 300, height: 200, perspective: 1000 }}>
      {[0, 1, 2, 3].map((index) => (
        <StyledCard key={index} index={index} onClick={index === 0 ? onFlip : undefined}>
          <Box sx={{ 
            transform: isFlipped && index === 0 ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            position: 'relative',
            width: '100%',
            height: '100%',
          }}>
            <CardFace isfront="true">
              <Typography variant="h5" fontWeight="bold">
                {index === 0 ? concept : ''}
              </Typography>
            </CardFace>
            <CardFace>
              <Typography variant="body1">
                {index === 0 ? explanation : ''}
              </Typography>
            </CardFace>
          </Box>
        </StyledCard>
      ))}
    </Box>
  );
};

export default ConceptCard;