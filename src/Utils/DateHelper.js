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
    return date - (date % millisecondsInWeek) - millisecondsInDay * 3;
};

const mondayOf = (date) => {
    return date - (date % millisecondsInWeek) - millisecondsInDay * 2;
};

const tuesdayOf = (date) => {
    return date - (date % millisecondsInWeek) - millisecondsInDay;
};

const wednesdayOf = (date) => {
    return date - (date % millisecondsInWeek);
};

const thursdayOf = (date) => {
    return date - (date % millisecondsInWeek) + millisecondsInDay;
};

const fridayOf = (date) => {
    return date - (date % millisecondsInWeek) + millisecondsInDay * 2;
};

const saturdayOf = (date) => {
    return date - (date % millisecondsInWeek) + millisecondsInDay * 3;
}

const weekOf = (date) => {
    return [sundayOf(date), mondayOf(date), tuesdayOf(date), wednesdayOf(date), thursdayOf(date), fridayOf(date), saturdayOf(date)];
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

    return dateFormat(dateAsDate, "YYYY-MM-DD");
}

/*
    dateToMySQLDateTime accepts a date as a number of milliseconds since epoch,
    and returns a string in the format "YYYY-MM-DDThh:mm:ss".

    This is the format for a DATETIME in MySQL.
 */
const dateToMySQLDateTime = (date) => {
    const dateAsDate = new Date(date);

    return dateFormat(dateAsDate, "YYYY-MM-DDThh:mm:ss");
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
    return new Date(date).getTime() + millisecondsInDay;
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
    shortDateFormat: shortDateFormat,
    shorterDateFormat: shorterDateFormat,
    dateRangeFormat: dateRangeFormat,
    dateToTextField: dateToTextField,
    textToDate: textToDate,
    getPlainWeekday
}