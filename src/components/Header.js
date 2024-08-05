import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

const Header = ({ user, onSignOut }) => {
  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : 'Usuario';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Memory Card
        </Typography>
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