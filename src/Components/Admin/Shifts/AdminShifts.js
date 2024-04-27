import React, { useState, useEffect, Fragment } from "react";
import API from "../../../API/API_Interface";
import DateHelper from "../../../Utils/DateHelper";
import ScheduleTopBar from "../../Generic/ScheduleTopBar";
import {
  Box,
  Button, capitalize,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem, Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InfoIcon from "@mui/icons-material/Info";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import SampleData from "../../../Utils/SampleData";
import AddIcon from "@mui/icons-material/Add";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AdminScheduleTopBar from "../Schedules/AdminScheduleTopBar";
import { generate } from "../../../Utils/ScheduleGeneration";
import { FcSettings } from "react-icons/fc";
import { useTheme } from "@mui/material/styles";
import EmployeeNotifications from "../../Employee/Notifications/EmployeeNotifications";
import AddShift from "./AddShift";

const segueStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function AdminDateCell({ date, idx }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const theme = useTheme();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const viewEmployeesAvailable = () => {
    console.log("Employees Available Clicked...");
    setAnchorEl(null);
  };

  const viewTimeOff = () => {
    console.log("Time Off Clicked...");
    setAnchorEl(null);
  };

  const options = [
    {
      title: "Employees Available",
      icon: <PeopleIcon fontSize="small" />,
      action: viewEmployeesAvailable,
    },
    {
      title: "Time Off Requests",
      icon: <EventAvailableIcon fontSize="small" />,
      action: viewTimeOff,
    },
  ];

  return (
    <TableCell
      key={idx + 1}
      align="center"
      style={{
        minWidth: 80,
        maxWidth: 80,
        borderLeft: "1px solid rgba(224, 224, 224, 1)",
        backgroundColor: theme.palette.primary.main,
        color: "white",
      }}
    >
      <Fragment>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "end",
            zIndex: "tooltip",
          }}
        >
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
            "aria-labelledby": "basic-button",
          }}
        >
          {options.map((option) => (
            <MenuItem onClick={option.action}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.title}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
        <Typography variant="caption" align="center" component="div">
          {DateHelper.getPlainWeekday(idx)}
        </Typography>
        <Typography variant="subtitle1" align="center" component="div">
          {DateHelper.shorterDateFormat(date)}
        </Typography>
      </Fragment>
    </TableCell>
  );
}

function AdminShiftsCell({ currentWeek, shifts, row_idx, col_idx, addShiftOpen, setAddShiftOpen, setSelectedDate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [employeeAvailable, setEmployeeAvailable] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("rgba(0, 0, 0, 0)");
  const menuOpen = Boolean(anchorEl);
  const theme = useTheme();

  const shiftsForColumn = shifts.filter(
      (s) =>
          DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) ===
          DateHelper.dateToMySQLDate(currentWeek[col_idx])
  );
  const shift = row_idx < shiftsForColumn.length ? shiftsForColumn[row_idx] : 0;

  const cellType =
      row_idx < shiftsForColumn.length
          ? 1
          : row_idx === shiftsForColumn.length
              ? 0
              : -1;

  useEffect (() => {
    async function checkAvailability() {
      try {
        const api = new API();

        if (shift.employee_id === null) {
          // Get list of employees who are trained to work this shift
          const trainedEmployeesResponse = await api.employeesTrainedInShift(shift.shift_id);
          const trainedEmployees = trainedEmployeesResponse.data.map(obj => obj.employee_id);

          // Get list of employees who are available to work this shift
          const availableEmployeesResponse = await api.employeesAvailableForShift(shift.shift_id);
          const availableEmployees = availableEmployeesResponse.data.map(obj => obj.employee_id);

          // If there are no employees available for this shift, log it and continue to next shift
          if (cellType > -1 && (!availableEmployees.length || !trainedEmployees.length)){
            //console.log("No Employees Available for Shift: " + shift.shift_id)
            // red
            setBackgroundColor("rgba(255, 0, 0, 0.1)");
          }
          else if (cellType > -1) {
            // yellow
            setBackgroundColor("rgba(255, 255, 0, 0.1)");
          }
          else {
            setBackgroundColor("rgba(0, 0, 0, 0)");
          }
        }
        else {
          setBackgroundColor("rgba(0, 0, 0, 0)");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    checkAvailability();
  }, [currentWeek, shifts])

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addShift = () => {
    setAddShiftOpen(true);
    setSelectedDate(currentWeek[col_idx])
  };

  const editShift = () => {
    console.log("Edit Shift Clicked...");
    setAnchorEl(null);
  };

  const deleteShift = () => {
    console.log("Delete Shift Clicked...");
    setAnchorEl(null);
  };

  const scheduledOptions = [
    {
      title: "Edit Shift",
      icon: <EditCalendarIcon fontSize="small" />,
      action: editShift,
    },
    {
      title: "Remove Shift",
      icon: <DeleteIcon fontSize="small" />,
      action: deleteShift,
    },
  ];

  return (
    <TableCell
      key={col_idx}
      align="center"
      style={{
        minWidth: 80,
        maxWidth: 80,
        borderLeft: "1px solid rgba(224, 224, 224, 1)",
        backgroundColor: backgroundColor
      }}
    >
      {cellType === 1 && (
        <Fragment>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "top",
              zIndex: "tooltip",
            }}
          >
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
              "aria-labelledby": "basic-button",
            }}
          >
            {scheduledOptions.map((option) => (
              <MenuItem onClick={option.action}>
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText>{option.title}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Fragment>
      )}
      <Fragment>
        {cellType === 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            {
              <Typography
                variant="subtitle1"
                align="center"
                component="div"
                flexGrow={1}
              >
                {ScheduleHelper.getTimesForShift(shift)}
              </Typography>
            }
            <Typography
              variant="caption"
              align="center"
              component="div"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {`Meal: ${ScheduleHelper.getMealTimesForShift(shift)}`}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              component="div"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {shift.employee_id != null
                ? `${shift.employee_fname} ${shift.employee_lname}`
                : "Any Employee"}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              component="div"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {capitalize(shift.department)}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              component="div"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {`${ScheduleHelper.getHoursForShift(shift)} hours`}
            </Typography>
          </Box>
        )}
        {cellType === 0 && (
          <Button endIcon={<AddIcon />} onClick={addShift} sx={{  fontWeight: theme.palette.type === 'dark' ? 'bold' : 'normal', fontSize: '16px', textShadow: theme.palette.type === 'dark' ? '1px 2px 2px rgba(0,0,0,0.5)' : null }}>
            Add Shift
          </Button>
        )}
      </Fragment>
    </TableCell>
  );
}

function AdminShiftsRow({ currentWeek, shifts, row_idx, addShiftOpen, setAddShiftOpen, setSelectedDate }) {
  return (
    <TableRow tabIndex={-1} key={1}>
      {currentWeek.map((date, col_idx) => (
        <AdminShiftsCell
          currentWeek={currentWeek}
          shifts={shifts}
          row_idx={row_idx}
          col_idx={col_idx}
          addShiftOpen={addShiftOpen}
          setAddShiftOpen={setAddShiftOpen}
          setSelectedDate={setSelectedDate}
        />
      ))}
    </TableRow>
  );
}

function AdminShiftsTable({ currentWeek, render, addShiftOpen, setAddShiftOpen, setSelectedDate }) {
  const [shifts, setShifts] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    async function fetchData() {
      console.log("fetching shifts");
      try {
        const api = new API();

        const shiftsResponse = await api.shiftsInRange(
          DateHelper.dateToMySQLDate(currentWeek[0]),
          DateHelper.dateToMySQLDate(currentWeek[6])
        );
        setShifts(shiftsResponse.data);

        //console.log("Shifts: " + JSON.stringify(shiftsResponse.data))
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [currentWeek, render, addShiftOpen]);

  return (
    <Paper
      sx={{ width: "100%", height: "100%", overflow: "hidden", minWidth: 560 }}
    >
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {currentWeek.map((date, idx) => (
                <AdminDateCell date={date} idx={idx} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ScheduleHelper.getNumRowsForShifts(currentWeek, shifts).map(
              (row_idx) => (
                <AdminShiftsRow
                  currentWeek={currentWeek}
                  shifts={shifts}
                  row_idx={row_idx}
                  addShiftOpen={addShiftOpen}
                  setAddShiftOpen={setAddShiftOpen}
                  setSelectedDate={setSelectedDate}
                />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function AdminShifts() {
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [currentWeek, setCurrentWeek] = useState(DateHelper.weekOf(Date.now()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(DateHelper.weekOf(Date.now())[0]);
  const [endDate, setEndDate] = useState(DateHelper.weekOf(Date.now())[6]);
  const [render, setRender] = useState(false);
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const theme = useTheme();

  const handleSetStartDate = (date) => {
    setStartDate(date);
  };

  const handleSetEndDate = (date) => {
    setEndDate(date);
  };

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

  const handleCloseAddShift = () => {
    setAddShiftOpen(false)
  };

  async function generateSchedule(){
    console.log("Generate Schedule Clicked...");

    try {
      const generatedSchedule = await generate(startDate, endDate);

      if (generatedSchedule) {
        console.log(generatedSchedule);
        setRender(!render);
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };

  return (
    <Fragment>
      <Modal
          open={addShiftOpen}
          onClose={handleCloseAddShift}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={segueStyle}>
          <AddShift date={selectedDate} setAddShiftOpen={setAddShiftOpen} sx={{

          }}/>
        </Box>
      </Modal>
      <AdminScheduleTopBar
        startDate={startDate}
        setStartDate={(date) => handleSetStartDate(date)}
        endDate={endDate}
        setEndDate={(date) => handleSetEndDate(date)}
        generateSchedule={() => generateSchedule()}
        currentWeek={currentWeek}
      />
      <Divider
        sx={{
          mt: 3,
          mb: 3,
        }}
      />
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

      <AdminShiftsTable
          currentWeek={currentWeek}
          render={render}
          addShiftOpen={addShiftOpen}
          setAddShiftOpen={setAddShiftOpen}
          setSelectedDate={setSelectedDate}
      />
    </Fragment>
  );
}

export default AdminShifts;
