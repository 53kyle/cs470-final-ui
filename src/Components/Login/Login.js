import React, {useState, useEffect, Fragment} from 'react';
import API from "../../API/API_Interface";

import {IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Button} from "@mui/material";
import {Box} from "@mui/material";
import {Divider} from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import hashCode from '../../Utils/hashPassword';

function Login({setUser}) {
    const [userInput, setUserInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [verifyInput, setVerifyInput] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleUserInputChange = event => {
        console.log("handleInputChange called.");

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Enter") {
            console.log("handleKeyPress: Verify input.");
            setVerifyInput(true);
        }
    };

    const handlePasswordInputChange = event => {
        console.log("handleInputChange called.");

        setPasswordInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Enter") {
            console.log("handleKeyPress: Verify input.");
            setVerifyInput(true);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {

        if( ! verifyInput || userInput.length === 0)
            return;

        const api = new API();
        async function getUserInfo() {
            api.getUserInfo(userInput)
                .then( userInfo => {
                    console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                    const user = userInfo.user;
                    if( userInfo.status === "OK" ) {
                        // If the hashed input and the stored hash aren't the same we fail
                        // Else we continue as normal
                        if(hashCode(passwordInput) !== userInfo.user.password_hash){
                            console.log("Incorrect Password")
                            setVerifyInput(false);
                            setAuthFailed(true);
                        }
                        else{
                            setUser(user);
                        }
                    } else  {
                        setVerifyInput(false);
                        setAuthFailed(true);
                    }
                });
        }

        getUserInfo();
    }, [verifyInput, setUser, userInput]);

    return (
        <Fragment>
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={10}>
                <Typography variant="h4" noWrap component="div" align="center">
                    Work Scheduler App
                </Typography>
            </Box>

            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={10}>
                <TextField
                    error={authFailed}
                    id="outlined-error-helper-text"
                    label="Employee ID"
                    placeholder=""
                    value={userInput}
                    helperText=""
                    onChange={handleUserInputChange}
                />
                <Divider />
            </Box>

            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2}>
                <TextField
                    error={authFailed}
                    id="outlined-error-helper-text"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                    placeholder=""
                    value={passwordInput}
                    helperText=""
                    onChange={handlePasswordInputChange}
                />
                <Divider />
            </Box>

            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2}>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => {
                        setVerifyInput(true);
                    }}
                >Log In</Button>
            </Box>
        </Fragment>
    );
}
export default Login;
