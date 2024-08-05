import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MemoryCard = ({ concept, explanation, isFlipped, onFlip, performance }) => {
  return (
    <Card 
      onClick={onFlip}
      sx={{ 
        width: 300,
        height: 200,
        perspective: '1000px',
        cursor: 'pointer',
        boxShadow: 'none',
        '& > div': {
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }
      }}
    >
      <Box sx={{ 
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        <CardContent sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#3498db',
          color: 'white',
          borderRadius: '4px',
        }}>
          <Typography variant="h5">{concept}</Typography>
          {performance && (
            <Typography variant="caption" sx={{ mt: 1 }}>
              Accuracy: {performance.accuracy.toFixed(2)}% ({performance.correctAttempts}/{performance.totalAttempts})
            </Typography>
          )}
        </CardContent>
        <CardContent sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2ecc71',
          color: 'white',
          transform: 'rotateY(180deg)',
          borderRadius: '4px',
        }}>
          <Typography variant="body1">{explanation}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default MemoryCard;