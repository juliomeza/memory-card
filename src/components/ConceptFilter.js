import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const ConceptFilter = ({ conceptFilter, onConceptFilterChange }) => {
  return (
    <Box 
      mb={2} 
      display="flex" 
      justifyContent="center"
      sx={{ maxWidth: 300, margin: '0 auto' }}
    >
      <ToggleButtonGroup
        value={conceptFilter}
        exclusive
        onChange={onConceptFilterChange}
        aria-label="concept filter"
        sx={{ 
          width: '100%',
          '& .MuiToggleButtonGroup-grouped': {
            border: 1,
            borderColor: 'divider',
            '&:not(:first-of-type)': {
              borderLeft: 1,
            },
            '&:first-of-type': {
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            },
            '&:last-of-type': {
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          },
        }}
      >
        <StyledToggleButton value="all" aria-label="all concepts">
          All
        </StyledToggleButton>
        <StyledToggleButton value="new" aria-label="new concepts">
          New
        </StyledToggleButton>
        <StyledToggleButton value="incorrect" aria-label="incorrect concepts">
          Incorrect
        </StyledToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ConceptFilter;