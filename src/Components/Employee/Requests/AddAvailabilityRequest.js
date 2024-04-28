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

function AddAvailabilityRequest({employee_id, setAddAvailabilityOpen}) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [selectedWeekday, setSelectedWeekday] = useState(weekdays[0]);
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("23:59");
    const [badInput, setBadInput] = useState(false);

    const handleWeekdayChange = (event) => {
        setSelectedWeekday(event.target.value)
    }

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
        setBadInput(DateHelper.textToDate(DateHelper.timeToDateTime(event.target.value)) > DateHelper.textToDate(DateHelper.timeToDateTime(endTime)));
    }

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
        setBadInput(DateHelper.textToDate(DateHelper.timeToDateTime(startTime)) > DateHelper.textToDate(DateHelper.timeToDateTime(event.target.value)));
    }

    const addAvailabilityRequest = async () => {
        if (DateHelper.textToDate(DateHelper.timeToDateTime(startTime)) > DateHelper.textToDate(DateHelper.timeToDateTime(endTime))) {
            return;
        }

        let availabilityRequest = {
            employee_id: employee_id,
            day_of_week: selectedWeekday,
            start_time: DateHelper.timeToMySQLTime(startTime),
            end_time: DateHelper.timeToMySQLTime(endTime),
            status: "Pending"
        }

        console.log(availabilityRequest)

        try {
            const api = new API();
            await api.addAvailability(availabilityRequest.employee_id, availabilityRequest.day_of_week, availabilityRequest.start_time, availabilityRequest.end_time);

            setAddAvailabilityOpen(false);
        } catch (error) {
            console.error("Error adding availability request:", error);
        }

    }

    return (
        <ModalContentBox title={'Add Availability Request'} content={
            <Fragment>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Weekday
                </Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedWeekday}
                    label="Department"
                    onChange={handleWeekdayChange}
                    sx={{
                        mt: 1,
                        mb: 2,
                        width: "100%"
                    }}
                >
                    {
                        weekdays.map((weekday, index) => (
                            <MenuItem value={weekday}>{weekday}</MenuItem>
                        ))
                    }
                </Select>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Time
                </Typography>
                <Box
                    display="flex"
                    justifyContent="start"
                    flexDirection="row"
                    alignItems="center"
                    textAlign="center"
                    width="100%"
                    mt={1}
                    mb={2}
                >
                    <TextField
                        id="outlined-number"
                        type="time"
                        size="small"
                        value={startTime}
                        error={badInput}
                        onChange={handleStartTimeChange}
                        sx={{ mr: 2, width: "100%"}}
                    />
                    <Typography
                        variant="body"
                        align="center"
                        component="div"
                    >
                        -
                    </Typography>
                    <TextField
                        id="outlined-number"
                        type="time"
                        size="small"
                        value={endTime}
                        error={badInput}
                        onChange={handleEndTimeChange}
                        sx={{ ml: 2, width: "100%" }}
                    />
                </Box>
                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    onClick={addAvailabilityRequest}
                    sx={{ mr: 2 }}
                >
                    Save
                </Button>
            </Fragment>

        }/>
    )
}

export default AddAvailabilityRequest;