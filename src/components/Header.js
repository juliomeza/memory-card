import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from './LoginButton';
import LevelProgressBar from './LevelProgressBar';
import { selectUser, selectIsAnonymous, selectCategoryProgress } from '../redux/selectors';
import { signOutUser } from '../redux/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAnonymous = useSelector(selectIsAnonymous);
  const categoryProgress = useSelector(selectCategoryProgress);
  const [anchorEl, setAnchorEl] = useState(null);

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : 'Usuario';
  };

  const getInitial = (fullName) => {
    return fullName ? fullName.charAt(0).toUpperCase() : 'U';
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(signOutUser());
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
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <LevelProgressBar 
            totalSegments={categoryProgress?.total || 0} 
            completedSegments={categoryProgress?.completed || 0} 
          />
        </Box>
        {!isAnonymous && user && (
          <>
            <IconButton
              onClick={handleClick}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <Typography variant="body1">
                {getInitial(user.displayName)}
              </Typography>
            </IconButton>
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