import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.default' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {!isAnonymous && user && (
          <>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              onClick={handleClick}
              sx={{ cursor: 'pointer' }}
            >
              {getFirstName(user.displayName)[0]}
            </Avatar>
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;