import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";

import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import SampleData from "../../../Utils/SampleData";
import ScheduleTopBar from "../../Generic/ScheduleTopBar";
import {Box, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

function EmployeeScheduleTable({currentWeek}) {

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', minWidth: 610 }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {
                                currentWeek.map((date, idx) => (
                                    <TableCell
                                        key={idx}
                                        align="center"
                                        style={{ minWidth: 80, maxWidth: 80, borderLeft: "1px solid rgba(224, 224, 224, 1)", backgroundColor: "#eff4fb" }}
                                    >
                                        <Fragment>
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
                                ))
                            }
                            <TableCell
                                key={8}
                                align="center"
                                style={{ minWidth: 50, maxWidth: 50, borderLeft: "1px solid rgba(224, 224, 224, 1)", backgroundColor: "#eff4fb" }}
                            >
                                <Typography variant="subtitle1" align="center" component="div">
                                    Total Hours
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow tabIndex={-1} key={1}>
                            {
                                SampleData.simpleSampleSchedule(currentWeek).map((date, idx) => (
                                    <TableCell
                                        key={idx}
                                        align="center"
                                        style={{ minWidth: 80, maxWidth: 80, borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
                                    >
                                        {
                                            ScheduleHelper.getHoursForShift(SampleData.simpleSampleSchedule(currentWeek)[idx]) ?
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <Typography variant="subtitle1" align="center" component="div">
                                                    {
                                                        `${SampleData.simpleSampleSchedule(currentWeek)[idx].start_time % 12 || "12"}${Math.floor(SampleData.simpleSampleSchedule(currentWeek)[idx].start_time/12) ? "pm" : "am" } - ${SampleData.simpleSampleSchedule(currentWeek)[idx].end_time % 12 || "12"}${Math.floor(SampleData.simpleSampleSchedule(currentWeek)[idx].end_time/12) ? "pm" : "am" }`
                                                    }
                                                </Typography>
                                                <Typography variant="caption" align="center" component="div">
                                                    {
                                                        SampleData.simpleSampleSchedule(currentWeek)[idx].position
                                                    }
                                                </Typography>
                                                <Typography variant="caption" align="center" component="div">
                                                    {
                                                        `${ScheduleHelper.getHoursForShift(SampleData.simpleSampleSchedule(currentWeek)[idx])} hours`
                                                    }
                                                </Typography>

                                            </Box> :
                                                <Typography variant="subtitle1" align="center" component="div" color="gray">
                                                    OFF
                                                </Typography>
                                        }
                                    </TableCell>
                                ))
                            }
                            <TableCell
                                key={8}
                                align="center"
                                style={{ minWidth: 50, maxWidth: 50, borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
                            >
                                <Typography variant="subtitle1" align="center" component="div">
                                    {
                                        ScheduleHelper.getHoursForSchedule(SampleData.simpleSampleSchedule(currentWeek))
                                    }
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

function EmployeeSchedule() {
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

            <EmployeeScheduleTable currentWeek={currentWeek}/>
        </Fragment>
    )
}

export default EmployeeSchedule;