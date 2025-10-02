'use client'

import { createTheme } from '@mui/material/styles'

// AutoFlow Dark Theme Configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#8b9cf7',
      dark: '#5568d3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9870c4',
      dark: '#6a3f8f',
      contrastText: '#ffffff',
    },
    success: {
      main: '#43e97b',
      light: '#6ff29a',
      dark: '#38d66c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f5576c',
      light: '#f77f8f',
      dark: '#dc4458',
    },
    background: {
      default: '#0f1419',
      paper: '#1a1f2e',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
})

export default darkTheme
