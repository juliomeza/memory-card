// src/components/GroupSummary.js

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RotatingStar from './RotatingStar';

const GroupSummary = ({ correctCount, totalCount, starColorIndex, onNextGroup }) => {
  const starColors = ['bronze', 'silver', 'gold', 'sapphire', 'titanium'];

  return (
    <Box textAlign="center" my={4}>
      <RotatingStar color={starColors[starColorIndex]} size={60} />
      <Typography variant="h6" mt={2}>Group Complete!</Typography>
      <Typography>
        Correct: {correctCount} / {totalCount}
      </Typography>
      <Button variant="contained" onClick={onNextGroup} sx={{ mt: 2 }}>
        Next Group
      </Button>
    </Box>
  );
};

export default GroupSummary;