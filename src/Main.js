import React, { useState, Fragment } from "react";
import Login from "./Components/Login/Login";
import App from "./App";
import { lightTheme } from "./Utils/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const logout = (setUser) => {
  return () => {
    setUser(undefined);
  };
};

function Main() {
  const [user, setUser] = useState(undefined);

  return (
    <Fragment>
      <ThemeProvider theme={lightTheme}>
        {user !== undefined ? (
          <App user={user} logoutAction={logout(setUser)} />
        ) : (
          <Login user={user} setUser={setUser} />
        )}
      </ThemeProvider>
    </Fragment>
  );
}

export default Main;
