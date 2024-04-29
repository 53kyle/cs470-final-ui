import React, {useState, useEffect, Fragment, useRef} from 'react';
import API from "../../../API/API_Interface";

import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import SampleData from "../../../Utils/SampleData";
import ScheduleTopBar from "../../Generic/ScheduleTopBar";
import AdminScheduleTopBar from "./AdminScheduleTopBar";
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { generate } from "../../../Utils/ScheduleGeneration";
import { post } from "../../../Utils/PostSchedule";
import {FcConferenceCall, FcEditImage, FcExpired, FcOvertime, FcPlus, FcReuse, FcSettings} from "react-icons/fc";
import { useTheme } from '@mui/material/styles'

import {
    Box, capitalize,
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
    const theme = useTheme();
    const iconColor = theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark;

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
            icon: <FcConferenceCall fontSize="26px"/>,
            action: viewEmployeesAvailable
        },
        {
            title: "Time Off Requests",
            icon: <FcOvertime fontSize="26px"/>,
            action: viewTimeOff
        },
        {
            title: "Shifts Needed",
            icon: <FcExpired fontSize="26px"/>,
            action: viewShiftsNeeded
        }
    ]

    return (
        <TableCell
            key={idx+1}
            align="center"
            style={{ minWidth: 80, maxWidth: 80, borderLeft: "1px solid rgba(224, 224, 224, 1)",  backgroundColor: theme.palette.primary.main, color: theme.palette.text.primary,}}
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
                        <InfoIcon fontSize="small" style={{ fontSize: "20px" , color: '#f0f0f0'}} />
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
                <Typography variant="caption" align="center" component="div" color="white">
                    {
                        DateHelper.getPlainWeekday(idx)
                    }
                </Typography>
                <Typography variant="subtitle1" align="center" component="div" color="white">
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
    const theme = useTheme();

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
            icon: <FcEditImage fontSize="26px"/>,
            action: editShift
        },
        {
            title: "Remove Shift",
            icon: <FcReuse fontSize="26px"/>,
            action: deleteShift
        }
    ]

    const unscheduledOptions = [
        {
            title: "Add Shift",
            icon: <FcPlus fontSize="26px"/>,
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
                    <FcSettings/>
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
                    shift.length > 0 ?
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
                            shift.length > 0 ?
                                <Typography variant="subtitle1" align="center" component="div" flexGrow={1}>
                                    {
                                        ScheduleHelper.getTimesForShift(shift[0])
                                    }
                                </Typography> :
                                <Typography variant="subtitle1" align="center" component="div" flexGrow={1} color="gray">
                                    OFF
                                </Typography>
                        }
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                shift.length > 0 ?
                                    `Meal: ${ScheduleHelper.getMealTimesForShift(shift[0])}` : " "
                            }
                        </Typography>
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                shift.length > 0 ?
                                    capitalize(shift[0].department) : " "
                            }
                        </Typography>
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                shift.length > 0 ?
                                    `${ScheduleHelper.getHoursForShift(shift[0])} hours` : " "
                            }
                        </Typography>
                    </Box>
                }
            </Fragment>
        </TableCell>
    );
}

function AdminScheduleRow({currentWeek, employee, shifts}) {

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
                </Box>
            </TableCell>
            {
                currentWeek.map((date, idx) => (
                    <AdminScheduleCell idx={idx} shift={
                        shifts.filter(s => s.employee_id == employee.employee_id && DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(date))
                    }/>
                ))
            }
            <TableCell
                key={8}
                align="center"
                style={{ minWidth: 50, maxWidth: 50, borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
            >
                <Typography variant="subtitle1" align="center" component="div">
                    {
                        ScheduleHelper.getHoursForSchedule(shifts.filter(s => s.employee_id == employee.employee_id))
                    }
                </Typography>
            </TableCell>
        </TableRow>
    );
}

function AdminScheduleTable({currentWeek}) {
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        async function fetchData() {

            try {
                const api = new API();

                const shiftsResponse = await api.shiftsInRange(DateHelper.dateToMySQLDate(currentWeek[0]), DateHelper.dateToMySQLDate(currentWeek[6]));
                setShifts(shiftsResponse.data);

                //console.log("Shifts: " + JSON.stringify(shiftsResponse.data))
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [currentWeek]);

    useEffect(() => {
        async function fetchData() {

            try {
                const api = new API();

                const employeesResponse = await api.allEmployees();
                setEmployees(employeesResponse.data);

                //console.log("Employees: " + JSON.stringify(employeesResponse.data))
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [])

    return (
        <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', minWidth: 710 }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key={0}
                                align="center"
                                style={{ minWidth: 100, maxWidth: 100, backgroundColor: theme.palette.primary.main, color: "white"}}
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
                                style={{ minWidth: 50, maxWidth: 50, borderLeft: "1px solid rgba(224, 224, 224, 1)",  backgroundColor: theme.palette.primary.main, color: "white"}}
                            >
                                Total Hours
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            employees.map((employee) => (
                                <AdminScheduleRow currentWeek={currentWeek} employee={employee} shifts={shifts}/>
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
        console.log("Generate Schedule Clicked..." )
        generate(startDate, endDate);
    }

    const postSchedule = () => {
        console.log("Post Schedule Clicked...")

        post(startDate, endDate);
    }

    return (
        <Fragment>
            <AdminScheduleTopBar
                startDate={startDate}
                setStartDate={(date) => handleSetStartDate(date)}
                endDate={endDate}
                setEndDate={(date) => handleSetEndDate(date)}
                postSchedule={() => postSchedule()}
                currentWeek={currentWeek}
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