import dateFormat, { masks } from "dateformat"

const millisecondsInMinute = 60000;
const millisecondsInHour = 3.6e+6;
const millisecondsInDay = 8.64e+7;
const millisecondsInWeek = 8.64e+7*7;

/*
    The following functions accept a date as a number of milliseconds
    since epoch, and return a date in the same form:
    sundayOf, mondayOf, tuesdayOf, wednesdayOf, thursdayOf, fridayOf, saturdayOf
 */
const sundayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek) - millisecondsInDay * 3;
    }
    return date - (date % millisecondsInWeek) - millisecondsInDay * 3 + millisecondsInWeek;
};

const mondayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek) - millisecondsInDay * 2;
    }
    return date - (date % millisecondsInWeek) - millisecondsInDay * 2 + millisecondsInWeek;
};

const tuesdayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek) - millisecondsInDay;
    }
    return date - (date % millisecondsInWeek) - millisecondsInDay + millisecondsInWeek;
};

const wednesdayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek);
    }
    return date - (date % millisecondsInWeek) + millisecondsInWeek;
};

const thursdayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek) + millisecondsInDay;
    }
    return date - (date % millisecondsInWeek) + millisecondsInDay + millisecondsInWeek;
};

const fridayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek) + millisecondsInDay * 2;
    }
    return date - (date % millisecondsInWeek) + millisecondsInDay * 2 + millisecondsInWeek;
};

const saturdayOf = (date) => {
    const dateAsDate = new Date(date);
    if(dateAsDate.getDay() > 3){
        return date - (date % millisecondsInWeek) + millisecondsInDay * 3;
    }
    return date - (date % millisecondsInWeek) + millisecondsInDay * 3 + millisecondsInWeek;
}

const weekOf = (date) => {
    return [sundayOf(date), mondayOf(date), tuesdayOf(date), wednesdayOf(date), thursdayOf(date), fridayOf(date), saturdayOf(date)];
}

const shortTimeFormat = (date) => {
    const dateAsDate = new Date(date);

    return dateFormat(dateAsDate, "hh:MM:ss")
}

const friendlyTimeFormat = (date) => {
    const dateAsDate = new Date(date);

    return `${dateFormat(dateAsDate, "h:MM")}${Math.floor(dateAsDate/12) ? "pm" : "am"}`
}

/*
    shortDateFormat accepts a date as a number of milliseconds, and
    returns a string in the format "mm/dd/yyyy"
 */
const shortDateFormat = (date) => {
    const dateAsDate = new Date(date);

    return `${dateAsDate.getMonth() + 1}/${dateAsDate.getDate()}/${dateAsDate.getFullYear()}`;
}

/*
    shorterDateFormat accepts a date as a number of milliseconds since epoch,
    and returns a string in the format "mm/dd"
 */
const shorterDateFormat = (date) => {
    const dateAsDate = new Date(date);

    return `${dateAsDate.getMonth() + 1}/${dateAsDate.getDate()}`;
}

/*
    dateRangeFormat accepts two dates as numbers of milliseconds since epoch,
    and returns a string in the format "mm/dd/yyyy - mm/dd/yyyy"
 */
const dateRangeFormat = (date1, date2) => {
    return `${shortDateFormat(date1)} - ${shortDateFormat(date2)}`
}

/*
    dateToTextField accepts a date as a number of milliseconds since epoch,
    and returns a string in the format "yyyy-mm-dd".

    This is the format for a date displayed by a text field.
 */
const dateToTextField = (date) => {
    const dateAsDate = new Date(date);

    return dateFormat(dateAsDate, "yyyy-mm-dd");
}

/*
    dateToMySQLDateTime accepts a date as a number of milliseconds since epoch,
    and returns a string in the format "YYYY-MM-DD".

    This is the format for a DATE in MySQL.
 */
const dateToMySQLDate = (date) => {
    const dateAsDate = new Date(date);

    return dateFormat(dateAsDate, "yyyy-mm-dd");
}

/*
    dateToMySQLDateTime accepts a date as a number of milliseconds since epoch,
    and returns a string in the format "YYYY-MM-DDThh:mm:ss".

    This is the format for a DATETIME in MySQL.
 */
const dateToMySQLDateTime = (date) => {
    const dateAsDate = new Date(date);

    return dateFormat(dateAsDate, "yyyy-mm-ddThh:MM:ss");
}

const dateTimeToMySQLDateTime = (date, time) => {
    const dateAsDate = new Date(date);
    const dateAsString = dateFormat(dateAsDate, "yyyy-mm-dd");
    const timeAsString = `${time}:00`;

    return `${dateAsString}T${timeAsString}`;
}

/*
    dateTimeToText accepts a date as a string in the form,
    "YYYY-MM-DD" or "YYYY-MM-DDThh:mm:ss" and returns a
    date as a number of milliseconds since epoch.

    This can be used to convert a date from a text field, a
    MySQL DATE, or a MySQL DATETIME to an easy to work with
    variable.
 */
const textToDate = (date) => {
    return new Date(date).getTime();
}

const getPlainWeekday = (idx) => {
    if (idx === 0) {
        return "Sunday"
    }
    else if (idx === 1) {
        return "Monday"
    }
    else if (idx === 2) {
        return "Tuesday"
    }
    else if (idx === 3) {
        return "Wednesday"
    }
    else if (idx === 4) {
        return "Thursday"
    }
    else if (idx === 5) {
        return "Friday"
    }
    else if (idx === 6) {
        return "Saturday"
    }
}

function mysqlDateToMilliseconds(mysqlDateString) {
    const mysqlDate = new Date(mysqlDateString);

    return mysqlDate.getTime();
}

const formatDateTime = (dateTimeString) => {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(undefined, options);
};

const formatTime = (timeString) => {
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Use 12-hour format
    };
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleString(undefined, options);
};

export default {
    millisecondsInMinute: millisecondsInMinute,
    millisecondsInHour: millisecondsInHour,
    millisecondsInDay: millisecondsInDay,
    millisecondsInWeek: millisecondsInWeek,
    sundayOf: sundayOf,
    mondayOf: mondayOf,
    tuesdayOf: tuesdayOf,
    wednesdayOf: wednesdayOf,
    thursdayOf: thursdayOf,
    fridayOf: fridayOf,
    saturdayOf: saturdayOf,
    weekOf: weekOf,
    shortTimeFormat: shortTimeFormat,
    friendlyTimeFormat: friendlyTimeFormat,
    shortDateFormat: shortDateFormat,
    shorterDateFormat: shorterDateFormat,
    dateRangeFormat: dateRangeFormat,
    dateToTextField: dateToTextField,
    textToDate: textToDate,
    getPlainWeekday: getPlainWeekday,
    dateToMySQLDate: dateToMySQLDate,
    dateTimeToMySQLDateTime: dateTimeToMySQLDateTime,
    mysqlDateToMilliseconds: mysqlDateToMilliseconds,
    formatDateTime,
    formatTime
}