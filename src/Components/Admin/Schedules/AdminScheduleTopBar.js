import React, {Fragment} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";

import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import DateHelper from "../../../Utils/DateHelper";

function AdminScheduleTopBar({startDate, setStartDate, endDate, setEndDate, generateSchedule, postSchedule}) {
    const handleStartDateChange = (event) => {
        setStartDate(DateHelper.textToDate(event.target.value));
    }

    const handleEndDateChange = (event) => {
        setEndDate(DateHelper.textToDate(event.target.value));
    }

    return(
        <Fragment>
            <Box sx={{
                height: 30,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <TextField
                    id="outlined-number"
                    type="date"
                    size="small"
                    value={DateHelper.dateToTextField(startDate)}
                    onChange={handleStartDateChange}
                    sx={{ mr: 2 }}
                />

                <Typography variant="h6" align="center" component="div" mr={2}>
                    -
                </Typography>

                <TextField
                    id="outlined-number"
                    type="date"
                    size="small"
                    value={DateHelper.dateToTextField(endDate)}
                    onChange={handleEndDateChange}
                    sx={{ mr: 2 }}
                />

                <Button
                    variant="contained"
                    endIcon={<EventRepeatIcon />}
                    onClick={generateSchedule}
                    sx={{ mr: 2 }}>
                        Generate Schedule
                </Button>

                <Button variant="contained" endIcon={<EventAvailableIcon />} onClick={postSchedule}>Post Schedule </Button>
            </Box>
        </Fragment>
    )
};

export default AdminScheduleTopBar;