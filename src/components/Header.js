import React from 'react';
import { AppBar, Toolbar, Typography, Box, Select, MenuItem, Button } from '@mui/material';

const Header = ({ user, selectedGroup, groups, onGroupChange, onSignOut }) => {
  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : 'Usuario';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Memory Card
        </Typography>
        <Box sx={{ minWidth: 120, mr: 2 }}>
          <Select
            value={selectedGroup}
            onChange={onGroupChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
          >
            <MenuItem value="" disabled>
              Group
            </MenuItem>
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {user && (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.isAnonymous ? "Anónimo" : getFirstName(user.displayName)}
            </Typography>
            <Button color="inherit" onClick={onSignOut}>
              Cerrar Sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;