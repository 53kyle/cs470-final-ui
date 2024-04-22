import API from "../API/API_Interface";
import DateHelper from "./DateHelper";

export async function post(startDate, endDate) {
    try {
        const api = new API();
        let shiftData = await api.shiftsInRange(DateHelper.dateToMySQLDate(startDate), DateHelper.dateToMySQLDate(endDate));

        shiftData.data.forEach(async shift => {
            if (shift.employee_id != null) {
                console.log(shift.shift_id)
                await api.postShift(shift.shift_id);
            }
            else{
                console.log("Warning: Attempting to post a shift that is unassigned")
            }
        });

        return {};
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
