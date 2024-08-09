import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '10px',
  backgroundColor: theme.palette.grey[300],
  borderRadius: '5px',
  overflow: 'hidden',
  display: 'flex',
}));

const ProgressSegment = styled(Box)(({ theme, isCompleted }) => ({
  flex: 1,
  height: '100%',
  backgroundColor: isCompleted ? theme.palette.text.primary : 'transparent',
  border: `1px solid ${theme.palette.grey[400]}`,
  transition: 'background-color 0.3s ease',
}));

const LevelProgressBar = ({ totalSegments, completedSegments }) => {
  return (
    <Tooltip title={`Progress: ${completedSegments}/${totalSegments} groups`} arrow>
      <ProgressContainer>
        {[...Array(totalSegments)].map((_, index) => (
          <ProgressSegment key={index} isCompleted={index < completedSegments} />
        ))}
      </ProgressContainer>
    </Tooltip>
  );
};

export default LevelProgressBar;