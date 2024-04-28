import React, { useState, useEffect, Fragment } from "react";
import API from "../../../API/API_Interface";
import {List, ListItem} from "@mui/material";

import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import SampleData from "../../../Utils/SampleData";
import ScheduleTopBar from "../../Generic/ScheduleTopBar";
import {
  Box, capitalize,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function EmployeeScheduleTable({ user, currentWeek }) {
  const [shifts, setShifts] = useState([]);
  const [punchIns, setPunchIns] = useState([]);
  const theme = useTheme();


  useEffect(() => {
    async function fetchData() {
      try {
        const api = new API();

        const shiftsResponse = await api.shiftsForEmployeeInRange(
          DateHelper.dateToMySQLDate(currentWeek[0]),
          DateHelper.dateToMySQLDate(currentWeek[6]),
          user.employee_id
        );
        setShifts(shiftsResponse.data);

        const punchResponse = await api.punchesOnDayForEmployee(
            user.employee_id,
            DateHelper.dateToMySQLDate(currentWeek[0]),
            DateHelper.dateToMySQLDate(currentWeek[6])
        );
        setPunchIns(punchResponse.data);

        if(shiftsResponse.data.length > 0){
          console.log("Shifts: " + JSON.stringify(shiftsResponse.data));
          console.log(new Date(shiftsResponse.data[0].date));
          console.log("Punch: " + JSON.stringify(punchResponse.data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [currentWeek, user]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", minWidth: 610 }}>
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {currentWeek.map((date, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  style={{
                    minWidth: 80,
                    maxWidth: 80,
                    borderLeft: "1px solid rgba(224, 224, 224, 1)",
                    backgroundColor: theme.palette.primary.main,
                    color: "white"
                  }}
                >
                  <Fragment>
                    <Typography
                      variant="caption"
                      align="center"
                      component="div"
                    >
                      {DateHelper.getPlainWeekday(idx)}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      component="div"
                    >
                      {DateHelper.shorterDateFormat(date)}
                    </Typography>
                  </Fragment>
                </TableCell>
              ))}
              <TableCell
                key={8}
                align="center"
                style={{
                  minWidth: 50,
                  maxWidth: 50,
                  borderLeft: "1px solid rgba(224, 224, 224, 1)",
                  backgroundColor: theme.palette.primary.main,
                  color: "white"
                }}
              >
                <Typography variant="subtitle1" align="center" component="div">
                  Total Hours
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow tabIndex={-1} key={1}>
              {currentWeek.map((date, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  style={{
                    minWidth: 80,
                    maxWidth: 80,
                    borderLeft: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  {shifts.filter(
                    (s) =>
                      DateHelper.dateToMySQLDate(
                        DateHelper.textToDate(s.date)
                      ) == DateHelper.dateToMySQLDate(date)
                  ).length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        align="center"
                        component="div"
                      >
                        {ScheduleHelper.getTimesForShift(
                          shifts.filter(
                            (s) =>
                              DateHelper.dateToMySQLDate(
                                DateHelper.textToDate(s.date)
                              ) == DateHelper.dateToMySQLDate(date)
                          )[0]
                        )}
                      </Typography>
                      <Typography
                        variant="caption"
                        align="center"
                        component="div"
                      >
                        {`Meal: ${ScheduleHelper.getMealTimesForShift(
                          shifts.filter(
                            (s) =>
                              DateHelper.dateToMySQLDate(
                                DateHelper.textToDate(s.date)
                              ) == DateHelper.dateToMySQLDate(date)
                          )[0]
                        )}`}
                      </Typography>
                      <Typography
                        variant="caption"
                        align="center"
                        component="div"
                      >
                        {
                          capitalize(shifts.filter(
                            (s) =>
                              DateHelper.dateToMySQLDate(
                                DateHelper.textToDate(s.date)
                              ) == DateHelper.dateToMySQLDate(date)
                          )[0].department)
                        }
                      </Typography>
                      <Typography
                        variant="caption"
                        align="center"
                        component="div"
                      >
                        {`${ScheduleHelper.getHoursForShift(
                          shifts.filter(
                            (s) =>
                              DateHelper.dateToMySQLDate(
                                DateHelper.textToDate(s.date)
                              ) == DateHelper.dateToMySQLDate(date)
                          )[0]
                        )} hours`}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      component="div"
                      color="gray"
                    >
                      OFF
                    </Typography>
                  )}
                </TableCell>
              ))}
              <TableCell
                key={8}
                align="center"
                style={{
                  minWidth: 50,
                  maxWidth: 50,
                  borderLeft: "1px solid rgba(224, 224, 224, 1)",
                }}
              >
                <Typography variant="subtitle1" align="center" component="div">
                  {ScheduleHelper.getHoursForSchedule(shifts)}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow tabIndex={-1} key={2}>
              {currentWeek.map((date, idx) => (
                  <TableCell
                      key={idx}
                      align="center"
                      style={{
                        minWidth: 80,
                        maxWidth: 80,
                        borderLeft: "1px solid rgba(224, 224, 224, 1)",
                      }}
                  >
                    <List>
                      {punchIns.filter(
                          punch => DateHelper.dateToMySQLDate(punch.punchin) === DateHelper.dateToMySQLDate(date)
                      ).length === 0 ? (
                          <ListItem>
                            <Typography variant="body1">
                              No Punches
                            </Typography>
                          </ListItem>
                      ) : (
                          punchIns
                              .filter(punch => DateHelper.dateToMySQLDate(punch.punchin) === DateHelper.dateToMySQLDate(date))
                              .map((punch, index) => (
                                  <Fragment key={index}>
                                    <ListItem>
                                      <Typography variant="subtitle1" align="center" component="div">
                                        {punch.punch_type}: {DateHelper.shortTimeFormat(punch.punchin)}
                                      </Typography>
                                    </ListItem>
                                  </Fragment>
                              ))
                      )}
                    </List>


                  </TableCell>
              ))}
              <TableCell
                  key={9}
                  align="center"
                  style={{
                    minWidth: 50,
                    maxWidth: 50,
                    borderLeft: "1px solid rgba(224, 224, 224, 1)",
                  }}
                  >
              </TableCell>
            </TableRow>


          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function EmployeeSchedule({ user }) {
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [currentWeek, setCurrentWeek] = useState(DateHelper.weekOf(Date.now()));

  const setPrevWeek = () => {
    const newDate = currentDate - DateHelper.millisecondsInDay * 7;
    setCurrentDate(newDate);
    setCurrentWeek(DateHelper.weekOf(newDate));
  };

  const setNextWeek = () => {
    const newDate = currentDate + DateHelper.millisecondsInDay * 7;
    setCurrentDate(newDate);
    setCurrentWeek(DateHelper.weekOf(newDate));
  };

  return (
    <Fragment>
      <ScheduleTopBar
        datesLabel={DateHelper.dateRangeFormat(currentWeek[0], currentWeek[6])}
        setPrevWeek={() => setPrevWeek()}
        setNextWeek={() => setNextWeek()}
      />

      <Divider
        sx={{
          mt: 3,
        }}
      />

      <EmployeeScheduleTable user={user} currentWeek={currentWeek} />
    </Fragment>
  );
}

export default EmployeeSchedule;
