import React, { useState } from 'react';
import API from "../../API/API_Interface";

import {
    Button,
    TextField,
    Typography,
} from "@mui/material";
import ModalContentBox from "../Generic/ModalContentBox";
import CheckIcon from '@mui/icons-material/Check';
import hashCode from '../../Utils/hashPassword';

function ChangePassword({ user, handleClose }) {
    const [existingPassword, setExistingPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [existingPasswordError, setExistingPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleSavePassword = async () => {

        try {
            const api = new API();
            
            setExistingPasswordError("");
            setConfirmPasswordError("");
            const hash = await api.employeeHash(user.employee_id)


            if (hashCode(existingPassword) !== hash.data[0].password_hash) {
                setExistingPasswordError("Incorrect password");
                return;
            }

            // check if new password matches confirm password
            if (newPassword !== confirmNewPassword) {
                setConfirmPasswordError("Passwords do not match");
                return;
            }

            // Call API to change password
            const response = await api.updatePassword(hashCode(newPassword), user.employee_id);

            handleClose();
        } catch (error) {
            console.error("Error changing password:", error);
        }
    };

    return (
        <ModalContentBox title={'Change Password'} content={
            <form>
                <Typography variant="body" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                    Existing Password
                </Typography>
                <TextField
                    type="password"
                    fullWidth
                    value={existingPassword}
                    onChange={(e) => setExistingPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    error={!!existingPasswordError}
                    helperText={existingPasswordError}
                />

                <Typography variant="body" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                    New Password
                </Typography>
                <TextField
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                />

                <Typography variant="body" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                    Confirm New Password
                </Typography>
                <TextField
                    type="password"
                    fullWidth
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError}
                />

                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    onClick={handleSavePassword}
                    sx={{ mt: 2 }}
                >
                    Save
                </Button>
            </form>
        } />
    );
}

export default ChangePassword;
