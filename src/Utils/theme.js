import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        type: 'light',
        primary: {
          main: '#008c8c',
          light: '#33a3a3',
          dark: '#006262',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f50057',
          light: '#f73378',
          dark: '#ab003c',
          contrastText: '#ffffff',
        },
        success: {
          main: '#008c8c',
        },
        background: {
          default: '#fafafa',
          paper: '#ffffff',
        },
        text: {
          primary: 'rgba(0,0,0,0.88)',
          secondary: 'rgba(0,0,0,0.54)',
          disabled: 'rgba(0,0,0,0.38)',
          hint: 'rgba(0,0,0,0.36)',
        },
      },
});

const darkTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
          main: '#008c8c',
          light: 'rgba(51,163,163,0.95)',
          dark: '#006262',
          contrastText: '#ffffff',
        },
        secondary: {
          main: 'rgba(245,0,87,0.95)',
          light: 'rgba(247,51,120,0.95)',
          dark: 'rgba(171,0,60,0.95)',
          contrastText: '#ffffff',
        },
        success: {
          main: '#008c8c',
        },
        background: {
          default: '#303030',
          paper: '#424242',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255,255,255,0.71)',
          disabled: 'rgba(255,255,255,0.5)',
          hint: 'rgba(255,255,255,0.5)',
        },
      },
});

export { lightTheme, darkTheme };
