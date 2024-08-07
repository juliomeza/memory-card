import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  maxWidth: '33%',
}));

const ConceptFilter = ({ conceptFilter, onConceptFilterChange }) => {
  return (
    <Box display="flex" justifyContent="center">
      <StyledToggleButtonGroup
        value={conceptFilter}
        exclusive
        onChange={onConceptFilterChange}
        aria-label="concept filter"
      >
        <StyledToggleButton value="all" aria-label="all concepts">
          ALL
        </StyledToggleButton>
        <StyledToggleButton value="new" aria-label="new concepts">
          NEW
        </StyledToggleButton>
        <StyledToggleButton value="incorrect" aria-label="incorrect concepts">
          INCORRECT
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default ConceptFilter;