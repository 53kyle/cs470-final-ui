import API from "../API/API_Interface";
import DateHelper from "./DateHelper";

// Find the entry with the lowest value
function getLowestEntry(entries) {
    // Uses reduce
    return entries.reduce((minEntry, currentEntry) => {
        // Ignore entries with null values
        if (currentEntry[1] !== null) {
            // If the current value is lower than the minimum value, update the minimum entry
            if (currentEntry[1] < minEntry[1] || minEntry[1] === null) {
                return currentEntry;
            }
        }
        return minEntry;
    }, entries[0]);
}

export async function generate(startDate, endDate) {
    try {
        const api = new API();
        // Fetch data from the API route
        const employeeData = await api.allEmployees();
        const shiftData = await api.shiftsInRange(DateHelper.dateToMySQLDate(startDate), DateHelper.dateToMySQLDate(endDate));

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
        shiftData.data.forEach(shift => {
            // Only look at a shift if it has no employee assigned to it
            if (shift.employee_id === null) {
                // Get lowest value
                //const lowestEntry = getLowestEntry(Object.entries(shiftsCountByEmployee));
                // Assign employee to shift
                //shift.employee_id = lowestEntry[0];
                // Inc their shift count
                //shiftsCountByEmployee[lowestEntry[0]]++;

                // narrow down by trained, then available
                // Find employee in list with least shifts
                // Make changes
            }
        });


        //console.log("Employee: " + JSON.stringify(employeeData.data))
        //console.log("Shift: " + JSON.stringify(shiftData.data))


        return { employeeData: employeeData.data, shiftData: shiftData.data };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
