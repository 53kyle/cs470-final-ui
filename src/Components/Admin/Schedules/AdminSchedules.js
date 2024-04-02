import React, {useState, useEffect, Fragment, useRef} from 'react';
import API from "../../../API/API_Interface";

import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import SampleData from "../../../Utils/SampleData";
import ScheduleTopBar from "../../Generic/ScheduleTopBar";
import AdminScheduleTopBar from "./AdminScheduleTopBar";
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
    Box,
    Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";


function AdminDateCell({date, idx}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const viewEmployeesAvailable = () => {
        console.log("Employees Available Clicked...")
        setAnchorEl(null);
    }

    const viewTimeOff = () => {
        console.log("Time Off Clicked...")
        setAnchorEl(null);
    }

    const viewShiftsNeeded = () => {
        console.log("Shifts Needed Clicked...")
        setAnchorEl(null);
    }

    const options = [
        {
            title: "Employees Available",
            icon: <PeopleIcon fontSize="small"/>,
            action: viewEmployeesAvailable
        },
        {
            title: "Time Off Requests",
            icon: <EventAvailableIcon fontSize="small"/>,
            action: viewTimeOff
        },
        {
            title: "Shifts Needed",
            icon: <PriorityHighIcon fontSize="small"/>,
            action: viewShiftsNeeded
        }
    ]

    return (
        <TableCell
            key={idx+1}
            align="center"
            style={{ minWidth: 80, maxWidth: 80, borderLeft: "1px solid rgba(224, 224, 224, 1)", backgroundColor: "#eff4fb"}}
        >
            <Fragment>
                <Box sx={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "end",
                    zIndex: 'tooltip'
                }}>
                    <IconButton aria-label="menu" size="small" onClick={handleOpen}>
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {
                        options.map((option) => (
                            <MenuItem onClick={option.action}>
                                <ListItemIcon>
                                    {option.icon}
                                </ListItemIcon>
                                <ListItemText>
                                    {option.title}
                                </ListItemText>
                            </MenuItem>
                        ))
                    }
                </Menu>
                <Typography variant="caption" align="center" component="div">
                    {
                        DateHelper.getPlainWeekday(idx)
                    }
                </Typography>
                <Typography variant="subtitle1" align="center" component="div">
                    {
                        DateHelper.shorterDateFormat(date)
                    }
                </Typography>
            </Fragment>
        </TableCell>
    );
}

function AdminScheduleCell({shift, idx}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const addShift = () => {
        console.log("Add Shift Clicked...")
        setAnchorEl(null);
    }

    const editShift = () => {
        console.log("Edit Shift Clicked...")
        setAnchorEl(null);
    }

    const deleteShift = () => {
        console.log("Delete Shift Clicked...")
        setAnchorEl(null);
    }

    const scheduledOptions = [
        {
            title: "Edit Shift",
            icon: <EditCalendarIcon fontSize="small"/>,
            action: editShift
        },
        {
            title: "Remove Shift",
            icon: <DeleteIcon fontSize="small"/>,
            action: deleteShift
        }
    ]

    const unscheduledOptions = [
        {
            title: "Add Shift",
            icon: <AddIcon fontSize="small"/>,
            action: addShift
        }
    ]

    return (
        <TableCell
            key={idx+1}
            align="center"
            style={{ minWidth: 80, maxWidth: 80, borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
        >
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "top",
                zIndex: 'tooltip'
            }}>
                <IconButton aria-label="menu" size="small" onClick={handleOpen}>
                    <SettingsIcon fontSize="small" />
                </IconButton>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {
                    shift.start_time >= 0 ?
                    scheduledOptions.map((option) => (
                        <MenuItem onClick={option.action}>
                            <ListItemIcon>
                                {option.icon}
                            </ListItemIcon>
                            <ListItemText>
                                {option.title}
                            </ListItemText>
                        </MenuItem>
                    )) : unscheduledOptions.map((option) => (
                            <MenuItem onClick={option.action}>
                                <ListItemIcon>
                                    {option.icon}
                                </ListItemIcon>
                                <ListItemText>
                                    {option.title}
                                </ListItemText>
                            </MenuItem>
                        ))

                }
            </Menu>
            <Fragment>
                {
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        {
                            ScheduleHelper.getHoursForShift(shift) ?
                                <Typography variant="subtitle1" align="center" component="div" flexGrow={1}>
                                    {
                                        `${shift.start_time % 12 || "12"}${Math.floor(shift.start_time/12) ? "pm" : "am" } - ${shift.end_time % 12 || "12"}${Math.floor(shift.end_time/12) ? "pm" : "am" }`
                                    }
                                </Typography> :
                                <Typography variant="subtitle1" align="center" component="div" flexGrow={1} color="gray">
                                    OFF
                                </Typography>
                        }

                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                ScheduleHelper.getHoursForShift(shift) ?
                                    shift.position : " "
                            }
                        </Typography>
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                ScheduleHelper.getHoursForShift(shift) ?
                                    `${ScheduleHelper.getHoursForShift(shift)} hours` : " "
                            }
                        </Typography>
                    </Box>
                }
            </Fragment>
        </TableCell>
    );
}

function AdminScheduleRow({currentWeek, employee, eIdx}) {

    return (
        <TableRow tabIndex={-1} key={1}>
            <TableCell
                key={0}
                align="center"
                style={{ minWidth: 80, maxWidth: 80 }}
            >
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Typography variant="subtitle1" align="center" component="div">
                        {
                            `${employee.first_name} ${employee.last_name}`
                        }
                    </Typography>
                    <Typography variant="caption" align="center" component="div">
                        {
                            `${employee.position}`
                        }
                    </Typography>
                </Box>
            </TableCell>
            {
                SampleData.complexSampleSchedule(currentWeek)[eIdx].schedule.map((shift, idx) => (
                    <AdminScheduleCell shift={shift} idx={idx}/>
                ))
            }
            <TableCell
                key={8}
                align="center"
                style={{ minWidth: 50, maxWidth: 50, borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
            >
                <Typography variant="subtitle1" align="center" component="div">
                    {
                        ScheduleHelper.getHoursForSchedule(SampleData.complexSampleSchedule(currentWeek)[eIdx].schedule)
                    }
                </Typography>
            </TableCell>
        </TableRow>
    );
}

function AdminScheduleTable({currentWeek}) {

    return (
        <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', minWidth: 710 }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key={0}
                                align="center"
                                style={{ minWidth: 100, maxWidth: 100, backgroundColor: "#eff4fb"}}
                            >
                                Employee
                            </TableCell>
                            {
                                currentWeek.map((date, idx) => (
                                    <AdminDateCell date={date} idx={idx}/>
                                ))
                            }
                            <TableCell
                                key={9}
                                align="center"
                                style={{ minWidth: 50, maxWidth: 50, borderLeft: "1px solid rgba(224, 224, 224, 1)", backgroundColor: "#eff4fb"}}
                            >
                                Total Hours
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            SampleData.sampleEmployees().map((employee, eIdx) => (
                                <AdminScheduleRow currentWeek={currentWeek} employee={employee} eIdx={eIdx}/>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
function AdminSchedules() {
    const [currentDate, setCurrentDate] = useState(Date.now());
    const [currentWeek, setCurrentWeek] = useState(DateHelper.weekOf(Date.now()));
    const [startDate, setStartDate] = useState(DateHelper.weekOf(Date.now())[0]);
    const [endDate, setEndDate] = useState(DateHelper.weekOf(Date.now())[6]);

    const setPrevWeek = () => {
        const newDate = currentDate - DateHelper.millisecondsInDay*7;
        setCurrentDate(newDate);
        setCurrentWeek(DateHelper.weekOf(newDate));
    }

    const setNextWeek = () => {
        const newDate = currentDate + DateHelper.millisecondsInDay*7;
        setCurrentDate(newDate);
        setCurrentWeek(DateHelper.weekOf(newDate));
    }

    const handleSetStartDate = (date) => {
        setStartDate(date);
    }

    const handleSetEndDate = (date) => {
        setEndDate(date);
    }

    const generateSchedule = () => {
        console.log("Generate Schedule Clicked...")
    }

    const postSchedule = () => {
        console.log("Post Schedule Clicked...")
    }

    return (
        <Fragment>
            <AdminScheduleTopBar
                startDate={startDate}
                setStartDate={(date) => handleSetStartDate(date)}
                endDate={endDate}
                setEndDate={(date) => handleSetEndDate(date)}
                generateSchedule={() => generateSchedule()}
                postSchedule={() => postSchedule()}
            />

            <Divider sx={{
                mt: 3,
                mb: 3
            }}/>

            <Typography variant="subtitle2" align="center" component="div">
                Current Schedule
            </Typography>

            <ScheduleTopBar
                datesLabel={DateHelper.dateRangeFormat(currentWeek[0], currentWeek[6])}
                setPrevWeek={() => setPrevWeek()}
                setNextWeek={() => setNextWeek()}
            />

            <Divider sx={{
                mt: 3
            }}/>

            <AdminScheduleTable currentWeek={currentWeek}/>
        </Fragment>
    )
}

export default AdminSchedules;