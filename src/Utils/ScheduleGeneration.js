import API from "../API/API_Interface";
import DateHelper from "./DateHelper";

export async function generate(startDate, endDate) {
    try {
        const api = new API();
        // Fetch data from the API route
        const employeeData = await api.allEmployees();
        let shiftData = await api.employeeCountByShift(DateHelper.dateToMySQLDate(startDate), DateHelper.dateToMySQLDate(endDate));

        // Create a map to store the number of shifts for each employee
        const shiftsCountByEmployee = {};

        // Initialize shift count for each employee
        employeeData.data.forEach(employee => {
            shiftsCountByEmployee[employee.employee_id] = 0;
        });

        // Count the number of shifts for each employee
        shiftData.data.forEach(shift => {
            shiftsCountByEmployee[shift.employee_id]++;
        });


        // Assign empty shifts to employees
        const shiftPromises = shiftData.data.map(async shift => {
            // Only look at a shift if it has no employee assigned to it

            if (shift.employee_id === null) {

                // Get list of employees who are trained to work this shift
                const trainedEmployeesResponse = await api.employeesTrainedInShift(shift.shift_id);
                const trainedEmployees = trainedEmployeesResponse.data.map(obj => obj.employee_id);

                // If there are no employees trained for this shift, log it and continue to next shift
                if(!trainedEmployees.length){
                    console.log("No Employees Trained for Shift: " + shift.shift_id)
                    return
                }

                // Get list of employees who are available to work this shift
                const availableEmployeesResponse = await api.employeesAvailableForShift(shift.shift_id);
                const availableEmployees = availableEmployeesResponse.data.map(obj => obj.employee_id);

                // If there are no employees available for this shift, log it and continue to next shift
                if(!availableEmployees.length){
                    console.log("No Employees Available for Shift: " + shift.shift_id)
                    return
                }

                // Fetches object containing all employees and the amount of shifts they have so far
                const employeeShiftCount = await api.employeeShiftsInRange(DateHelper.dateToMySQLDate(startDate), DateHelper.dateToMySQLDate(endDate));

                // Narrows down employee selection from both the trained and available employees
                const intersectionArray = trainedEmployees.filter(element => availableEmployees.includes(element));

                // Filters employees shift count by eligible employees
                const filteredData = employeeShiftCount.data.filter(item => intersectionArray.includes(item.employee_id));

                // If there is no employee who is available and trained, log and continue to next shift
                if(!filteredData.length){
                    console.log("No Employees Available and Trained for Shift: " + shift.shift_id)
                    return
                }

                // Get the first and last day of the work week
                const start_of_week = DateHelper.dateToMySQLDate(DateHelper.weekOf(DateHelper.mysqlDateToMilliseconds(shift.start_time))[0])
                const end_of_week = DateHelper.dateToMySQLDate(DateHelper.weekOf(DateHelper.mysqlDateToMilliseconds(shift.start_time))[6])

                // Get the hours of each employee
                const employee_hours = await api.employeeHoursInRange(start_of_week, end_of_week);

                // Filter out employees with more than their max hours, and logs who
                const newFilteredEmployees = [];

                filteredData.forEach(obj => {
                    const hasEmployeeId = employee_hours.data.some(obj => obj.employee_id === obj.employee_id);
                    if(hasEmployeeId){
                        const employeeHourData = employee_hours.data.find(obj => obj.employee_id === obj.employee_id).total_hours;
                        if(employeeHourData + shift.length > 40){
                            console.log("Employee " + obj.employee_id + " is already working their max hours and can't work for Shift: " + shift.shift_id)
                        }
                        else{
                            newFilteredEmployees.push(obj);
                        }
                    }
                    else{
                        newFilteredEmployees.push(obj);
                    }
                });


                // Find the min number of shifts
                const minShifts = newFilteredEmployees[0].count

                // List all employees eligible with min shifts
                const employeesWithMinShifts = filteredData.filter(entry => entry.count === minShifts);

                // Get random value in the range of the possible options
                const randomIndex = Math.floor(Math.random() * employeesWithMinShifts.length);

                // Select that random employee ID
                const randomID = employeesWithMinShifts[randomIndex].employee_id;

                await api.updateShift(randomID, shift.shift_id);

            }
        });

        await Promise.all(shiftPromises);

        return { employeeData: employeeData.data, shiftData: shiftData.data };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
