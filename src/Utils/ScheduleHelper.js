const getHoursForShift = (shift) => {
    return (shift.end_time - shift.start_time - shift.meal_length);
}

const getHoursForSchedule = (schedule) => {
    let total = 0;

    for (let shift of schedule) {
        total += getHoursForShift(shift);
    }

    return total;
}

const getMapForShifts = (shifts) => {
    const numRows = Math.max(
        shifts[0].shifts.length,
        shifts[1].shifts.length,
        shifts[2].shifts.length,
        shifts[3].shifts.length,
        shifts[4].shifts.length,
        shifts[5].shifts.length,
        shifts[6].shifts.length
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
    getHoursForShift: getHoursForShift,
    getHoursForSchedule: getHoursForSchedule,
    getMapForShifts: getMapForShifts
}