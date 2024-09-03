import React, { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { getAuth } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';

const LoginButton = () => {
  const [open, setOpen] = useState(false);
  const [isUIRendered, setIsUIRendered] = useState(false);
  const uiRef = useRef(null);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsUIRendered(false);
  };

  useEffect(() => {
    if (open) {
      setIsUIRendered(true);
    }
  }, [open]);

  useEffect(() => {
    if (open && isUIRendered && !uiRef.current) {
      const auth = getAuth();
      uiRef.current = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      uiRef.current.start('#firebaseui-auth-container', {
        signInOptions: [
          {
            provider: 'google.com',
            customParameters: {
              prompt: 'select_account'
            }
          },
          'password'
        ],
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: (authResult) => {
            dispatch(setUser({
              uid: authResult.user.uid,
              email: authResult.user.email,
              displayName: authResult.user.displayName,
              photoURL: authResult.user.photoURL,
              isAnonymous: authResult.user.isAnonymous,
            }));
            handleClose();
            return false; // Prevent redirect
          },
        },
      });
    }
  }, [open, isUIRendered, dispatch]);

  return (
    <>
      <Button color="inherit" onClick={handleClickOpen}>
        Log In
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Log In</DialogTitle>
        <DialogContent>
          <div id="firebaseui-auth-container"></div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginButton;