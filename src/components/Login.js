import React, { useState } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import AnonymousLogin from './AnonymousLogin';

const Login = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setSnackbarMessage('Failed to sign in with Google. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box mt={4} textAlign="center">
      <Typography variant="h6" gutterBottom>
        Inicia sesión para guardar tus puntajes:
      </Typography>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleGoogleSignIn} sx={{ mr: 2 }}>
          Google
        </Button>
        <AnonymousLogin />
      </Box>
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