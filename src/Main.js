import React, { useState, Fragment } from 'react';
import Login from './Components/Login/Login';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
    palette: {
        primary:  {
          main: '#428bca',
          contrastText: "#fff"  // Change to your primary color
        },
        secondary: {
          main: '#CFB095', // Change to your secondary color
        },
      },
      typography: {
        fontFamily: '', // Change to your preferred font family
        fontSize: 16, // Change to your preferred base font size
      },
  });

const logout = (setUser) => {

    return () => {
        setUser(undefined);
    }
};

function Main() {
    const [user, setUser] = useState(undefined);

    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Fragment>
            {
                user !== undefined ? (
                    <App
                        user={user}
                        logoutAction={logout(setUser)}
                    />
                ) : (
                    <Login
                        user={user}
                        setUser={setUser}
                    />
                )
            }
        </Fragment>
        </ThemeProvider>
    )
}

export default Main;