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

function AddTraining({untrainedDepartments, setDepartmentToAdd, setAddTrainingOpen}) {
    const [department, setDepartment] = useState("");
    const [addNewDepartment, setAddNewDepartment] = useState(false);
    const [newDepartment, setNewDepartment] = useState("");
    const addTraining = async () => {
        if (addNewDepartment && newDepartment !== "") {
            setDepartmentToAdd(newDepartment);
        }
        else if (!addNewDepartment && department !== "") {
            setDepartmentToAdd(department);
        }
        setAddTrainingOpen(false);
    }

    const handleDepartmentChange = (event) => {
        if (event.target.value === "Other") {
            setAddNewDepartment(true);
        }
        else {
            setAddNewDepartment(false);
        }
        setDepartment(event.target.value)
    }

    return (
        <ModalContentBox handleClose={() => setAddTrainingOpen(false)} title={`Add Training`} content={
            <Fragment>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Department
                </Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={department}
                    label="Department"
                    onChange={handleDepartmentChange}
                    sx={{
                        mt: 1,
                        mb: 2,
                        width: "100%"
                    }}
                >
                    {
                        untrainedDepartments.map((untrainedDepartment, index) => (
                            <MenuItem value={untrainedDepartment}>{untrainedDepartment}</MenuItem>
                        ))
                    }
                    <MenuItem value={"Other"}>{"Other"}</MenuItem>
                </Select>
                {
                    addNewDepartment &&
                    <Fragment>
                        <Typography
                            variant="body"
                            align="center"
                            component="div"
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            New Department Name
                        </Typography>
                        <TextField id="outlined-controlled" label="Name" variant="outlined" sx={{
                            mt: 1,
                            mb: 2,
                            width: "100%"
                        }} value={newDepartment}
                                   onChange={(event) => {
                                       setNewDepartment(event.target.value);
                                   }}/>
                    </Fragment>
                }
                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    onClick={addTraining}
                    sx={{ mr: 2 }}
                >
                    Save
                </Button>
            </Fragment>

        }/>
    )
}

export default AddTraining;