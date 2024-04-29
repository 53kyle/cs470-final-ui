import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";

import {
    Button,
    Checkbox,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateHelper from "../../../Utils/DateHelper";
import ModalContentBox from "../../Generic/ModalContentBox";
import CheckIcon from '@mui/icons-material/Check';
import dateFormat from "dateformat";

function AddEmployee({setAddEmployeeOpen}) {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [permission, setPermission] = useState(false);
    const [maxHours, setMaxHours] = useState(40);
    const [defaultPassword, setDefaultPassword] = useState("");

    const handleTogglePermission = (event) => {
        setPermission(event.target.checked);
    };

    function hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    const addEmployee = async () => {
        let employee = {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            permission: permission,
            password_hash: hashCode(defaultPassword),
            max_hours: maxHours
        }

        console.log(employee)

        try {
            const api = new API();
            await api.addEmployee(employee);

            setAddEmployeeOpen(false);
        } catch (error) {
            console.error("Error adding employee:", error);
        }

    }

    return (
        <ModalContentBox handleClose={() => setAddEmployeeOpen(false)} title={'Add Employee'} content={
            <Fragment>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    First Name
                </Typography>
                <TextField id="outlined-controlled" label="First Name" variant="outlined" sx={{
                    mt: 1,
                    mb: 2,
                    width: "100%"
                }} value={firstName}
                           onChange={(event) => {
                               setFirstName(event.target.value);
                           }}/>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Middle Name
                </Typography>
                <TextField id="outlined-controlled" label="Middle Name" variant="outlined" sx={{
                    mt: 1,
                    mb: 2,
                    width: "100%"
                }} value={middleName}
                           onChange={(event) => {
                               setMiddleName(event.target.value);
                           }}/>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Last Name
                </Typography>
                <TextField id="outlined-controlled" label="Last Name" variant="outlined" sx={{
                    mt: 1,
                    mb: 2,
                    width: "100%"
                }} value={lastName}
                           onChange={(event) => {
                               setLastName(event.target.value);
                           }}/>
                <Box
                    display="flex"
                    justifyContent="start"
                    flexDirection="row"
                    alignItems="center"
                    textAlign="center"
                    width="100%"
                    mb={2}
                >
                    <Checkbox
                        checked={permission}
                        onChange={handleTogglePermission}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Typography
                        variant="body"
                        align="center"
                        component="div"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        Admin
                    </Typography>
                </Box>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Max Hours
                </Typography>
                <TextField id="outlined-controlled" variant="outlined" type="number" InputLabelProps={{ shrink: true }} sx={{
                    mt: 1,
                    mb: 2,
                    width: "100%"
                }} value={maxHours}
                           onChange={(event) => {
                               setMaxHours(event.target.value);
                           }}/>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Default Password
                </Typography>
                <TextField id="outlined-controlled" variant="outlined" type="password" sx={{
                    mt: 1,
                    mb: 2,
                    width: "100%"
                }} value={defaultPassword}
                           onChange={(event) => {
                               setDefaultPassword(event.target.value);
                           }}/>
                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    onClick={addEmployee}
                    sx={{ mr: 2 }}
                >
                    Save
                </Button>
            </Fragment>

        }/>
    )
}

export default AddEmployee;