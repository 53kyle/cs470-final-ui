import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";
import ContentBox from "../../Generic/ContentBox";
import {
    Button,
    capitalize,
    Checkbox,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    Select,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import CircleIcon from '@mui/icons-material/Circle';
import ModalContentBox from "../../Generic/ModalContentBox";
import CheckIcon from '@mui/icons-material/Check';
import dateFormat from "dateformat";

function AddShift({editShift, date, setAddShiftOpen}) {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [meal, setMeal] = useState(true);
    const [mealStart, setMealStart] = useState("12:30");
    const [mealEnd, setMealEnd] = useState("13:30");

    useEffect(() => {
        if (editShift) {
            setSelectedDepartment(editShift.department);
            setSelectedEmployee(editShift.employee_id);

            const startTimeAsDate = new Date(editShift.start_time);
            const endTimeAsDate = new Date(editShift.end_time);
            setStartTime(dateFormat(startTimeAsDate, "HH:MM"))
            setEndTime(dateFormat(endTimeAsDate, "HH:MM"))

            setMeal(editShift.meal);
            if (editShift.meal) {
                const mealStartAsDate = new Date(editShift.meal_start);
                const mealEndAsDate = new Date(editShift.meal_end);
                setMealStart(dateFormat(mealStartAsDate, "HH:MM"))
                setMealEnd(dateFormat(mealEndAsDate, "HH:MM"))
            }
        }
        async function fetchData() {

            try {
                const api = new API();

                const employeesResponse = await api.allEmployees();
                setEmployees(employeesResponse.data);

                const trainedResponse = await api.getTrained();
                setDepartments(trainedResponse.data.map((trained) => trained.department));
                if (trainedResponse.data.length > 0 && !editShift) {
                    setSelectedDepartment(trainedResponse.data.map((trained) => trained.department)[0]);
                }

                console.log(trainedResponse.data.map((trained) => trained.department));

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [date]);

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
    }

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
    }

    const handleToggleMeal = (event) => {
        setMeal(event.target.checked);
    };

    const handleMealStartChange = (event) => {
        setMealStart(event.target.value);
    }

    const handleMealEndChange = (event) => {
        setMealEnd(event.target.value);
    }

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value)
    }

    const handleEmployeeChange = (event) => {
        console.log(event.target.value)
        setSelectedEmployee(event.target.value)
    }

    const addShift = async () => {
        let startDate = DateHelper.textToDate(DateHelper.dateTimeToMySQLDateTime(date, startTime));
        let endDate = DateHelper.textToDate(DateHelper.dateTimeToMySQLDateTime(date, endTime));

        if (startDate > endDate) {
            endDate += DateHelper.millisecondsInDay;
        }

        let shift = {
            department: selectedDepartment,
            employee_id: selectedEmployee || null,
            start_time: DateHelper.dateTimeToMySQLDateTime(startDate, startTime),
            end_time: DateHelper.dateTimeToMySQLDateTime(endDate, endTime),
            meal: meal,
            meal_start: meal ? DateHelper.dateTimeToMySQLDateTime(date, mealStart) : null,
            meal_end: meal ? DateHelper.dateTimeToMySQLDateTime(date, mealEnd) : null,
            posted: false
        }

        console.log(shift)

        if (editShift) {
            shift = {...shift, shift_id: editShift.shift_id}
            try {
                const api = new API();
                await api.editShift(shift);

                setAddShiftOpen(false);
            } catch (error) {
                console.error("Error editing shift:", error);
            }
        }
        else {
            try {
                const api = new API();
                await api.addShift(shift);

                setAddShiftOpen(false);
            } catch (error) {
                console.error("Error adding shift:", error);
            }
        }

    }

    return (
        <ModalContentBox title={editShift ? "Edit Shift" : `Add Shift for ${DateHelper.shortDateFormat(date)}`} content={
            <Fragment>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Training Required
                </Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDepartment}
                    label="Department"
                    onChange={handleDepartmentChange}
                    sx={{
                        mt: 1,
                        mb: 2
                    }}
                >
                    {
                        departments.map((department, index) => (
                            <MenuItem value={department}>{department}</MenuItem>
                        ))
                    }
                </Select>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Employee
                </Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedEmployee}
                    label="Employee"
                    onChange={handleEmployeeChange}
                    sx={{
                        mt: 1,
                        mb: 2
                    }}
                >
                    <MenuItem value={null}>{"Any Employee"}</MenuItem>
                    {
                        employees.map((employee, index) => (
                            <MenuItem value={employee.employee_id}>{`${employee.first_name} ${employee.last_name}`}</MenuItem>
                        ))
                    }
                </Select>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Shift Time
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
                        onChange={handleStartTimeChange}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        id="outlined-number"
                        type="time"
                        size="small"
                        value={endTime}
                        onChange={handleEndTimeChange}
                        sx={{ mr: 2 }}
                    />
                </Box>
                <Box
                    display="flex"
                    justifyContent="start"
                    flexDirection="row"
                    alignItems="center"
                    textAlign="center"
                    width="100%"
                >
                    <Checkbox
                        checked={meal}
                        onChange={handleToggleMeal}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Typography
                        variant="body"
                        align="center"
                        component="div"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        Meal
                    </Typography>
                </Box>
                <Typography
                    variant="body"
                    align="center"
                    component="div"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    Meal Time
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
                        value={mealStart}
                        onChange={handleMealStartChange}
                        sx={{ mr: 2 }}
                        disabled={!meal}
                    />
                    <TextField
                        id="outlined-number"
                        type="time"
                        size="small"
                        value={mealEnd}
                        onChange={handleMealEndChange}
                        sx={{ mr: 2 }}
                        disabled={!meal}
                    />
                </Box>
                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    onClick={addShift}
                    sx={{ mr: 2 }}
                >
                    Save
                </Button>
            </Fragment>

        }/>
    )
}

export default AddShift;