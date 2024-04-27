import DateHelper from "./DateHelper";
import dateFormat from "dateformat";

const getTimesForShift = (shift) => {
    const startHour = new Date(shift.start_time).getHours();
    const endHour = new Date(shift.end_time).getHours();

    return `${dateFormat(shift.start_time, "h:MM")}${Math.floor(startHour/12) ? "pm" : "am"} - ${dateFormat(shift.end_time, "h:MM")}${Math.floor(endHour/12) ? "pm" : "am"}`
}

const getMealTimesForShift = (shift) => {
    if (!shift.meal) {
        return 'N/A'
    }

    const startHour = new Date(shift.meal_start).getHours();
    const endHour = new Date(shift.meal_end).getHours();

    return `${dateFormat(shift.meal_start, "h:MM")}${Math.floor(startHour/12) ? "pm" : "am"} - ${dateFormat(shift.meal_end, "h:MM")}${Math.floor(endHour/12) ? "pm" : "am"}`
}

const getHoursForShift = (shift) => {
    const startHour = new Date(shift.start_time).getHours();
    const endHour = new Date(shift.end_time).getHours();
    const mealLength = new Date(shift.meal_end).getHours() - new Date(shift.meal_start).getHours();

    let hours = (endHour - startHour - mealLength)
    return hours < 0 ? hours + 24 : hours;
}

const getHoursForSchedule = (schedule) => {
    let total = 0;

    for (let shift of schedule) {
        total += getHoursForShift(shift);
    }

    return total;
}

const getNumRowsForShifts = (currentWeek, shifts) => {
    const numRows = Math.max(
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[0])).length,
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[1])).length,
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[2])).length,
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[3])).length,
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[4])).length,
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[5])).length,
        shifts.filter(s => DateHelper.dateToMySQLDate(DateHelper.textToDate(s.date)) == DateHelper.dateToMySQLDate(currentWeek[6])).length
    ) + 1;

    return [...Array(numRows).keys()];
}

/*const getIsolatedShifts = (shifts) => {
    const isolatedShifts = [
        shifts[0].shifts,
        shifts[1].shifts,
        shifts[2].shifts,
        shifts[3].shifts,
        shifts[4].shifts,
        shifts[5].shifts,
        shifts[6].shifts
    ];
}

const getDataForShiftsTable = (shifts) => {
    const isolatedShifts = getIsolatedShifts(shifts);
    let ret_shifts = [];

    for (let i = 0; i < isolatedShifts.length; i += 1) {

    }
}*/

export default {
    getTimesForShift: getTimesForShift,
    getMealTimesForShift: getMealTimesForShift,
    getHoursForShift: getHoursForShift,
    getHoursForSchedule: getHoursForSchedule,
    getNumRowsForShifts: getNumRowsForShifts
}