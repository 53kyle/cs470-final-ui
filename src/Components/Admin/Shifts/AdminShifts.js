import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";
import DateHelper from "../../../Utils/DateHelper";
import ScheduleTopBar from "../../Generic/ScheduleTopBar";
import {
    Box, Button,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InfoIcon from "@mui/icons-material/Info";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import SampleData from "../../../Utils/SampleData";
import AddIcon from '@mui/icons-material/Add';
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

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

function AdminShiftsCell({currentWeek, row_idx, col_idx}) {
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
    }

    const editShift = () => {
        console.log("Edit Shift Clicked...")
        setAnchorEl(null);
    }

    const deleteShift = () => {
        console.log("Delete Shift Clicked...")
        setAnchorEl(null);
    }

    const shiftsForColumn = SampleData.sampleShifts(currentWeek)[col_idx].shifts;
    const shift = row_idx < shiftsForColumn.length ? shiftsForColumn[row_idx] : 0;

    const cellType = row_idx < shiftsForColumn.length ? 1 : row_idx === shiftsForColumn.length ? 0 : -1;

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

    return (
        <TableCell
            key={col_idx}
            align="center"
            style={{ minWidth: 80, maxWidth: 80, borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
        >
            {
                cellType === 1 &&
                <Fragment>
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
                            scheduledOptions.map((option) => (
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
                </Fragment>
            }
            <Fragment>
                {
                    cellType === 1 &&
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        {
                            <Typography variant="subtitle1" align="center" component="div" flexGrow={1}>
                                {
                                    `${shift.start_time % 12 || "12"}${Math.floor(shift.start_time/12) ? "pm" : "am" } - ${shift.end_time % 12 || "12"}${Math.floor(shift.end_time/12) ? "pm" : "am" }`
                                }
                            </Typography>
                        }
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                shift.employee_id != -1 ? "" : "Any Employee"
                            }
                        </Typography>
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                shift.position
                            }
                        </Typography>
                        <Typography variant="caption" align="center" component="div" style={{ whiteSpace: "pre-wrap" }}>
                            {
                                `${ScheduleHelper.getHoursForShift(shift)} hours`
                            }
                        </Typography>
                    </Box>
                }
                {
                    cellType === 0 &&
                    <Button endIcon={<AddIcon />} onClick={addShift}>Add Shift</Button>
                }
            </Fragment>
        </TableCell>
    );
}

function AdminShiftsRow({currentWeek, row_idx}) {

    return (
        <TableRow tabIndex={-1} key={1}>
            {
                currentWeek.map((date, col_idx) => (
                    <AdminShiftsCell currentWeek={currentWeek} row_idx={row_idx} col_idx={col_idx}/>
                ))
            }
        </TableRow>
    );
}

function AdminShiftsTable({currentWeek}) {

    return (
        <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', minWidth: 560 }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {
                                currentWeek.map((date, idx) => (
                                    <AdminDateCell date={date} idx={idx}/>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            ScheduleHelper.getMapForShifts(SampleData.sampleShifts(currentWeek)).map((row_idx) => (
                                <AdminShiftsRow currentWeek={currentWeek} row_idx={row_idx} />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

function AdminShifts() {
    const [currentDate, setCurrentDate] = useState(Date.now());
    const [currentWeek, setCurrentWeek] = useState(DateHelper.weekOf(Date.now()));

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

    return (
        <Fragment>
            <ScheduleTopBar
                datesLabel={DateHelper.dateRangeFormat(currentWeek[0], currentWeek[6])}
                setPrevWeek={() => setPrevWeek()}
                setNextWeek={() => setNextWeek()}
            />
            <Divider sx={{
                mt: 3
            }}/>

            <AdminShiftsTable currentWeek={currentWeek}/>
        </Fragment>
    )
}

export default AdminShifts;