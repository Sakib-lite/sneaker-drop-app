import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: palette.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: palette.text.primary,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: palette.text.primary,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: palette.text.primary,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      color: palette.text.primary,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: palette.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: palette.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      color: palette.text.secondary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
