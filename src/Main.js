import React, { useState, Fragment } from 'react';
import Login from './Components/Login/Login';
import App from './App';

const logout = (setUser) => {

    return () => {
        setUser(undefined);
    }
};

function Main() {
    const [user, setUser] = useState(undefined);

    return (
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
    )
}

export default Main;