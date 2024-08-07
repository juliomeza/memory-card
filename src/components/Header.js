import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import LoginButton from './LoginButton';

const Header = ({ user, onSignOut, isAnonymous }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : 'Usuario';
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    onSignOut();
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Memory Card
        </Typography>
        <Box display="flex" alignItems="center">
          {!isAnonymous && user && (
            <>
              <Button color="inherit" onClick={handleClick}>
                {getFirstName(user.displayName)}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          )}
          {isAnonymous && <LoginButton />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;