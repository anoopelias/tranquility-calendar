import { getTranqDateStr, getTranqYearStr } from "./tranq.js";
import { cellString, getLastDateOfMonth, lookups } from "./common.js";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getGregDateStr(date) {
    return monthNames[date.month - 1] + " " + date.day;
}

export function getGregYearStr(year) {
    //TODO: Handle AD/BC
    return year + "";
}

function toTranqYear(gregYear) {
    // For year conversion, look at the sample below,
    //
    // 67-68       -2L
    // 68-69       -1
    // 69-70       1
    // 70-71       2
    // 71-72       3L
    // 72-73       4
    // 69-70       5
    // 70-71       6
    // 71-72       7L
    // 72-73       8
    //
    // L - is a leap year
    // Please note that there is no '0' Tranq year
    //
    // Output Tranquility year is the year when the input Gregorian year ends.
    //

    let tranqYear = gregYear - 1969;
    if (gregYear >= 1969) {
        tranqYear++;
    }

    return tranqYear;
}

function getDatesOfMonth(year, month) {
    const datesOfMonth = [];
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const prevMonth = getPrevMonth(year, month);

    let lastDateOfPrevMonth = getLastDateOfMonth(
        isLeapYear(prevMonth.year),
        prevMonth.month
    );

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        datesOfMonth.unshift({
            date: {
                year: prevMonth.year,
                month: prevMonth.month,
                day: lastDateOfPrevMonth--
            },
            selectable: false
        });
    }

    const lastDateOfThisMonth = getLastDateOfMonth(isLeapYear(year), month);

    for (let i = 1; i <= lastDateOfThisMonth; i++) {
        datesOfMonth.push({
            date: {
                year: year,
                month: month,
                day: i
            },
            selectable: true
        });
    }

    const nextMonth = getNextMonth(year, month);
    let i = 1;
    while (datesOfMonth.length <= 42) {
        datesOfMonth.push({
            date: {
                year: nextMonth.year,
                month: nextMonth.month,
                day: i++
            },
            selectable: false
        });
    }

    return datesOfMonth;
}

function setCalendarGrid(datesOfMonth) {
    $(".calendar-container .cell").removeClass("cell-disabled");
    $(".calendar-container .cell").each(function(index) {
        $(this).data(datesOfMonth[index].date);
        $(this)
            .find(".cell-value")
            .text(datesOfMonth[index].date.day);

        if (!datesOfMonth[index].selectable) {
            $(this).addClass("cell-disabled");
        }

        const tranqDate = toTranq(datesOfMonth[index].date);
        $(this)
            .find("#date")
            .text(getTranqDateStr(tranqDate));
        $(this)
            .find("#year")
            .text(getTranqYearStr(tranqDate.year));
    });
}

function setYearMonth(year, month) {
    // TODO: Handle AD/BC
    $("#month").text(monthNames[month - 1] + ", " + year);
}

export function setDay(month, day) {
    $(".calendar-container .cell").removeClass("cell-selected");
    if (!isNaN(day) && day <= 42) {
        $(".calendar-container .cell")
            .filter(function(index) {
                let date = $(this).data();
                return date.month === month && date.day === day;
            })
            .addClass("cell-selected");
    }
}
export function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

export function toTranq(date) {
    let lookupTable;
    if (isLeapYear(date.year)) {
        lookupTable = lookups.leapYear.greg;
    } else {
        lookupTable = lookups.normalYear.greg;
    }
    // Do a shallow copy since the object could be changed
    const tranqDate = Object.assign(
        {},
        lookupTable[date.month - 1][date.day - 1]
    );

    tranqDate.year = toTranqYear(date.year);
    if (!tranqDate.secondHalfYear) {
        tranqDate.year = tranqDate.year === 1 ? -1 : tranqDate.year - 1;
    }

    return tranqDate;
}

export function getToday() {
    let today = new Date();
    return {
        year: 1900 + today.getYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
    };
}

export function setDate(date) {
    let datesOfMonth = getDatesOfMonth(date.year, date.month);
    setCalendarGrid(datesOfMonth);
    setDay(date.month, date.day);
    setYearMonth(date.year, date.month);
}

export function getNextMonth(year, month) {
    // TODO: Handle AD/BC
    return {
        month: month === 12 ? 1 : month + 1,
        year: month === 12 ? year + 1 : year
    };
}

export function getPrevMonth(year, month) {
    // TODO: Handle AD/BC
    return {
        month: month === 1 ? 12 : month - 1,
        year: month === 1 ? year - 1 : year
    };
}

export function load() {
    $("#title").text("Gregorian Calendar");
    $(".head-cell").each(function(index) {
        $(this).text(weekDays[index]);
    });
    $(".cell").remove();
    for (let i = 0; i < 42; i++) {
        $(".calendar-container").append(cellString);
    }
}

export function generateHash(date) {
    return name + "_" + date.year + "_" + date.month + "_" + date.day;
}

export function parseHash(hash) {
    const splits = hash.split("_");
    const date = {};
    date.year = parseInt(splits[1]);

    if (isNaN(date.year)) {
        return getToday();
    }

    date.month = parseInt(splits[2]);
    if (isNaN(date.month)) {
        return getToday();
    }

    date.day = parseInt(splits[3]);
    if (isNaN(date.day)) {
        // If day is not there, we should load month
        date.day = undefined;
    }
    return date;
}

export const name = "greg";
