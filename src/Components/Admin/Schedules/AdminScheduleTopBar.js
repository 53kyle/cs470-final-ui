import React, {Fragment, useState} from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    LinearProgress
} from "@mui/material";

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import DateHelper from "../../../Utils/DateHelper";


import { post } from "../../../Utils/PostSchedule";

import API from "../../../API/API_Interface";

import notificationSound from "../../../Utils/notification.wav";
import {ContentPaste, CopyAll} from "@mui/icons-material";
import {paste} from "@testing-library/user-event/dist/paste";

const style = {
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function AdminScheduleTopBar({startDate, setStartDate, endDate, setEndDate, currentWeek, generateSchedule, postSchedule, numShifts, setNumShifts, numShiftsFilled, render, setRender}) {
    const [open, setOpen] = React.useState(false);
    const [unfilledShifts, setUnfilledShifts] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [copiedShifts, setCopiedShifts] = useState([]);
    const [copiedWeek, setCopiedWeek] = useState(currentWeek);
    const playNotificationSound = () => {
        const sound = new Audio(notificationSound);
        sound.play();
      };

    const handleOpen = async () => {
        playNotificationSound();
        setOpen(true);
        await fetchUnfilledShifts();
    }
    const handleClose = () => setOpen(false);
    const handleStartDateChange = (event) => {
        setStartDate(DateHelper.textToDate(event.target.value)+DateHelper.millisecondsInDay);
    }

    const handleEndDateChange = (event) => {
        setEndDate(DateHelper.textToDate(event.target.value)+DateHelper.millisecondsInDay);
    }

    const handleCurrentWeek = () => {
        setStartDate(currentWeek[0]);
        setEndDate(currentWeek[6]);
    }

    const copyShifts = async () => {
        try {
            const api = new API();
            const shiftData = await api.shiftsInRange(DateHelper.dateToMySQLDate(startDate), DateHelper.dateToMySQLDate(endDate));
            setCopiedShifts(shiftData.data);
            setCopiedWeek(currentWeek);
        } catch (error) {
            console.error('Error copying shifts:', error);
        }
    }

    const pasteShifts = async () => {
        const diff = currentWeek[0] - copiedWeek[0];
        const api = new API();

        if (diff === 0) {
            return;
        }

        copiedShifts.forEach(async (shift) => {
            let newDate = DateHelper.textToDate(shift.date) + diff;
            let newStartTime = DateHelper.textToDate(shift.start_time) + diff;
            let newEndTime = DateHelper.textToDate(shift.end_time) + diff;
            let newMealStart = shift.meal_start ? DateHelper.textToDate(shift.meal_start) + diff : null;
            let newMealEnd = shift.meal_end ? DateHelper.textToDate(shift.meal_start) + diff : null;

            const newShift = {
                ...shift,
                posted: false,
                employee_id: null,
                date: DateHelper.dateToMySQLDateTime(newDate),
                start_time: DateHelper.dateToMySQLDateTime(newStartTime),
                end_time: DateHelper.dateToMySQLDateTime(newEndTime),
                meal_start: DateHelper.dateToMySQLDateTime(newMealStart),
                meal_end: DateHelper.dateToMySQLDateTime(newMealEnd)
            };

            try {
                await api.addShift(newShift);
                setRender(!render);
            } catch (error) {
                console.error("Error adding shift:", error);
            }
        });
    }

    const fetchUnfilledShifts = async () => {
        try {
            const api = new API();
            const shiftData = await api.shiftsInRange(DateHelper.dateToMySQLDate(startDate), DateHelper.dateToMySQLDate(endDate));
            setShifts(shiftData.data)
            const unfilledShifts = shiftData.data.filter(shift => shift.employee_id === null && shift.posted === 0);
            setUnfilledShifts(unfilledShifts);
            setNumShifts(unfilledShifts.length);
        } catch (error) {
            console.error('Error fetching unfilled shifts:', error);
        }
    };

    return(
        !numShiftsFilled || numShiftsFilled === 0 ?
        <Fragment>
            <Box sx={{
                height: 30,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Button
                    variant="contained"
                    endIcon={<CalendarTodayIcon />}
                    onClick={handleCurrentWeek}
                    sx={{ mr: 2 }}
                >
                    Current Week
                </Button>

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

                {generateSchedule && (
                    <>
                        <Button
                            variant="contained"
                            endIcon={<EventAvailableIcon />}
                            onClick={handleOpen}
                            sx={{ mr: 2 }}
                        >
                            Generate Schedule
                        </Button>
                        {unfilledShifts.length == 0 ? (
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle
                                    id="alert-dialog-title"
                                    sx={{
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {"No shifts to fill!"}
                                </DialogTitle>
                                <DialogActions sx={{ justifyContent: 'space-between' }}>
                                    <Button onClick={handleClose}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        ) : (
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="confirmation-dialog-title"
                                aria-describedby="confirmation-dialog-description"
                            >
                                <Typography variant="h5" align="center" component="div" mt={4}>
                                    Generating Shifts:
                                </Typography>
                                <Typography variant="h5" align="center" component="div">
                                    {DateHelper.formatDateTime(startDate)}
                                </Typography>
                                <Typography variant="h5" align="center" component="div">
                                    -
                                </Typography>
                                <Typography variant="h5" align="center" component="div">
                                    {DateHelper.formatDateTime(endDate)}
                                </Typography>
                                <DialogTitle id="confirmation-dialog-title">Are you sure you want to Generate {unfilledShifts.length} Shifts?</DialogTitle>
                                <DialogActions>
                                    <Button onClick={() => { generateSchedule(); handleClose(); }} >
                                        Yes
                                    </Button>
                                    <Button onClick={handleClose} autoFocus color="error">
                                        No
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </>
                )}

                {generateSchedule && (
                    <>
                        <Button
                            variant="contained"
                            endIcon={<CopyAll />}
                            onClick={copyShifts}
                            sx={{ mr: 2 }}
                        >
                            Copy
                        </Button>
                    </>
                )}
                {generateSchedule && (
                    <>
                        <Button
                            variant="contained"
                            endIcon={<ContentPaste />}
                            onClick={pasteShifts}
                            disabled={copiedShifts.length === 0}
                        >
                            Paste
                        </Button>
                    </>
                )}
                {postSchedule && (
                    <>
                        <Button
                            variant="contained"
                            endIcon={<EventAvailableIcon />}
                            onClick={handleOpen}
                        >
                            Post Schedule
                        </Button>
                        {unfilledShifts.length > 0 ? (
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle
                                    id="alert-dialog-title"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'red'
                                    }}
                                >
                                    {"Warning: Unfilled Shifts"}
                                </DialogTitle>
                                <DialogContent>
                                    <List>
                                        {unfilledShifts.map((shift, index) => (
                                            <ListItem key={shift.shift_id}>
                                                <ListItemText
                                                    primary={`Shift #${index + 1}`}
                                                    secondary={(
                                                        <div>
                                                            Start Time: {DateHelper.formatDateTime(shift.start_time)}<br />
                                                            End Time: {DateHelper.formatDateTime(shift.end_time)}<br />
                                                            Department: {shift.department}
                                                        </div>
                                                    )}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </DialogContent>
                                <DialogActions sx={{ justifyContent: 'space-between' }}>
                                    <Button onClick={() => { postSchedule(); handleClose(); }} color="error">
                                        Post Anyways
                                    </Button>
                                    <Button onClick={handleClose}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        ) : (
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="confirmation-dialog-title"
                                aria-describedby="confirmation-dialog-description"
                            >
                                <DialogTitle id="confirmation-dialog-title">Are you sure you want to post this schedule? ({shifts.length} Shifts)</DialogTitle>
                                <DialogActions>
                                    <Button onClick={() => { postSchedule(); handleClose(); }} color="error">
                                        Yes
                                    </Button>
                                    <Button onClick={handleClose} autoFocus>
                                        No
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </>
                )}

            </Box>
        </Fragment> : <Fragment>
                <Typography variant="h6" align="center" component="div" width="100%" mb={2}>
                    {`Generating Shift ${numShiftsFilled} of ${numShifts}...`}
                </Typography>
                <LinearProgress variant="determinate" value={100*(numShiftsFilled/numShifts)} sx={{ml: 25, mr: 25}}/>
            </Fragment>
    )
};

export default AdminScheduleTopBar;