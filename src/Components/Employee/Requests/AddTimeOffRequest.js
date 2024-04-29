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

function AddTimeOffRequest({employee_id, setAddTimeOffOpen}) {
    const reasons = ["Vacation", "Personal Day", "Sick Leave", "Family Emergency", "Doctor's Appointment", "Other"];
    const [selectedReason, setSelectedReason] = useState(reasons[0]);
    const [startDate, setStartDate] = useState(DateHelper.weekOf(Date.now())[0]);
    const [endDate, setEndDate] = useState(DateHelper.weekOf(Date.now())[6]);
    const [badInput, setBadInput] = useState(false);

    const handleReasonChange = (event) => {
        setSelectedReason(event.target.value)
    }

    const handleStartDateChange = (event) => {
        setStartDate(DateHelper.textToDate(event.target.value))
        setBadInput(DateHelper.textToDate(event.target.value) > endDate);
    }

    const handleEndDateChange = (event) => {
        setEndDate(DateHelper.textToDate(event.target.value))
        setBadInput(startDate > DateHelper.textToDate(event.target.value));
    }

    const addTimeOffRequest = async () => {
        if (startDate > endDate) {
            return;
        }

        let timeOffRequest = {
            employee_id: employee_id,
            start_date: DateHelper.dateToMySQLDateTime(startDate),
            end_date: DateHelper.dateToMySQLDateTime(endDate),
            reason: selectedReason,
            status: "Pending"
        }

        console.log(timeOffRequest)

        try {
            const api = new API();
            await api.addTimeOff(timeOffRequest.employee_id, timeOffRequest.start_date, timeOffRequest.end_date, timeOffRequest.reason);

            setAddTimeOffOpen(false);
        } catch (error) {
            console.error("Error adding time off request:", error);
        }

    }

    return (
        <ModalContentBox handleClose={() => setAddTimeOffOpen(false)} title={'Request Time Off'} content={
            <Fragment>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Start Date
                </Typography>
                <TextField
                    id="outlined-number"
                    type="datetime-local"
                    size="small"
                    error={badInput}
                    value={DateHelper.dateToAdvancedTextField(startDate)}
                    onChange={handleStartDateChange}
                    sx={{
                        mt: 1,
                        mb: 2,
                        width: "100%"
                    }}
                />
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    End Date
                </Typography>
                <TextField
                    id="outlined-number"
                    type="datetime-local"
                    size="small"
                    error={badInput}
                    value={DateHelper.dateToAdvancedTextField(endDate)}
                    onChange={handleEndDateChange}
                    sx={{
                        mt: 1,
                        mb: 2,
                        width: "100%"
                    }}
                />
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Reason
                </Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedReason}
                    label="Department"
                    onChange={handleReasonChange}
                    sx={{
                        mt: 1,
                        mb: 2,
                        width: "100%"
                    }}
                >
                    {
                        reasons.map((reason, index) => (
                            <MenuItem value={reason}>{reason}</MenuItem>
                        ))
                    }
                </Select>
                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    onClick={addTimeOffRequest}
                    sx={{ mr: 2 }}
                >
                    Save
                </Button>
            </Fragment>

        }/>
    )
}

export default AddTimeOffRequest;