// src/styles/

import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#E8E8E8',
      light: '#F5F5F5',
      dark: '#D0D0D0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#CCCCCC',
      light: '#E0E0E0',
      dark: '#BABABA',
      contrastText: '#000000',
    },
    background: {
      default: '#F5F5F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#4A4A4A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontSize: '1.25rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5F0',
          color: '#000000',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.15)', // Sombra más pronunciada y hacia abajo
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          margin: '0 4px',
          padding: '6px 16px',
          border: 'none',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)', // Sombra más pronunciada y hacia abajo
          '&.Mui-selected': {
            backgroundColor: '#E8E8E8',
            color: '#000000',
            boxShadow: 'inset 0px -4px 4px rgba(0, 0, 0, 0.1)', // Sombra interior cuando está seleccionado
            '&:hover': {
              backgroundColor: '#D0D0D0',
            },
          },
          '&:hover': {
            backgroundColor: '#F0F0F0',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 8,
        },
        grouped: {
          '&:not(:first-of-type)': {
            borderRadius: 20,
          },
          '&:first-of-type': {
            borderRadius: 20,
          },
        },
      },
    },
  },
});

export default appTheme;