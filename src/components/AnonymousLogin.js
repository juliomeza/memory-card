import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

const AnonymousLogin = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error during anonymous sign in:", error);
      setSnackbarMessage('Failed to sign in anonymously. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleAnonymousSignIn}
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando...' : 'Anónimo'}
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default AnonymousLogin;