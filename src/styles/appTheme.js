import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#4A6572', // Azul grisáceo medio
      light: '#8AA1AD', // Azul grisáceo claro
      dark: '#2C3E50', // Azul grisáceo oscuro
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F9C6C6', // Rosa pálido
      light: '#FFE3E3',
      dark: '#E5A4A4',
      contrastText: '#333333',
    },
    background: {
      default: '#E0E5E9', // Gris muy claro
      paper: '#F5F7F9', // Blanco grisáceo
    },
    text: {
      primary: '#2C3E50', // Azul grisáceo oscuro
      secondary: '#4A6572', // Azul grisáceo medio
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#F5F7F9', // Blanco grisáceo
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#E0E5E9', // Gris muy claro
          '&:hover': {
            backgroundColor: '#C9D6DE', // Un poco más oscuro al hover
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Bordes redondeados uniformes
          margin: '0 4px', // Pequeño margen horizontal
          padding: '6px 16px',
          border: 'none',
          backgroundColor: '#E0E5E9',
          color: '#4A6572',
          '&.Mui-selected': {
            backgroundColor: '#4A6572',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#3A5162',
            },
          },
          '&:hover': {
            backgroundColor: '#C9D6DE',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 8, // Espacio entre botones
        },
        grouped: {
          '&:not(:first-of-type)': {
            borderRadius: 20, // Asegura que los botones del medio y final tengan bordes redondeados
          },
          '&:first-of-type': {
            borderRadius: 20, // Asegura que el primer botón tenga bordes redondeados
          },
        },
      },
    },
  },
});

export default appTheme;