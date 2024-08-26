// src/components/

import React from 'react';
import { Box } from '@mui/material';
import ThumbButton from './ThumbButton';
import ProgressCircle from './ProgressCircle';

const GameControls = ({ onThumbUp, onThumbDown, isButtonDisabled, current, total, thumbUpColor, thumbDownColor }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      width="100%" 
      maxWidth="300px" 
      mt={2} 
      mb={2}
      px={1}
    >
      <Box width="33%" display="flex" justifyContent="flex-start">
        <ThumbButton 
          direction="up"
          onClick={onThumbUp}
          disabled={isButtonDisabled}
          color={thumbUpColor}
        />
      </Box>
      <Box width="33%" display="flex" justifyContent="center">
        <ProgressCircle current={current} total={total} />
      </Box>
      <Box width="33%" display="flex" justifyContent="flex-end">
        <ThumbButton 
          direction="down"
          onClick={onThumbDown}
          disabled={isButtonDisabled}
          color={thumbDownColor}
        />
      </Box>
    </Box>
  );
};

export default GameControls;