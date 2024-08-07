import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

const LoginButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const credential = GoogleAuthProvider.credential(credentialResponse.credential);
      await signInWithCredential(auth, credential);
      handleClose();
    } catch (error) {
      console.error("Error during Google sign in:", error);
    }
  };

  return (
    <>
      <Button color="inherit" onClick={handleClickOpen}>
        Log In
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Log In</DialogTitle>
        <DialogContent>
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginButton;