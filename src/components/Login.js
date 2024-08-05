import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGoogleSignIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setSnackbarMessage('Failed to sign in with Google. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  const handleAnonymousSignIn = useCallback(async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error during anonymous sign in:", error);
      setSnackbarMessage('Failed to sign in anonymously. Please try again.');
      setSnackbarOpen(true);
    }
  }, []);

  return (
    <Box mt={4} textAlign="center">
      {!showAuthOptions ? (
        <Button variant="contained" color="primary" onClick={() => setShowAuthOptions(true)}>
          Guardar Puntajes
        </Button>
      ) : (
        <Box>
          <Typography variant="body1" gutterBottom>
            Inicia sesión para guardar tus puntajes:
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoogleSignIn} sx={{ mr: 2 }}>
            Google
          </Button>
          <Button variant="contained" color="secondary" onClick={handleAnonymousSignIn}>
            Anónimo
          </Button>
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Login;