import { cellString, lookups } from "./common.js";
import * as greg from "./greg.js";

const monthNames = [
    "Archimedes",
    "Brahe",
    "Copernicus",
    "Darwin",
    "Einstein",
    "Faraday",
    "Galileo",
    "Hippocrates",
    "Imhotep",
    "Jung",
    "Kepler",
    "Lavoisier",
    "Mendel"
];

const weekDays = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

function isLeapYear(year) {
    // If the Gregorian year corresponding to the second half
    // of Tranquility year is a leap year, then the Tranquility year
    // is a leap year. This is because Feb 29/Aldrin day falls in the
    // second half of Tranquility year.
    return greg.isLeapYear(toGregYear(year) + 1);
}

export function toGregYear(tranqYear) {
    // For year conversion, look at the sample below,
    //
    // Strart       End
    // 21 Jul 67 to 20 Jul 68       -2L
    // 21 Jul 68 to 20 Jul 69       -1
    // 21 Jul 69 to 20 Jul 70       1
    // 21 Jul 70 to 20 Jul 71       2
    // 21 Jul 71 to 20 Jul 72       3L
    //
    // This function returns the Gregorian year as of
    // new year of the input Tranquility year
    //
    // Input        Output
    // -2           1967
    // -1           1968
    // 1            1969
    // 2            1970
    //

    let gregYear = tranqYear + 1969;
    if (tranqYear >= 1) {
        gregYear--;
    }

    return gregYear;
}

export function toGreg(date) {
    let lookupTable;
    let gregDate;

    if (date.aldrinDay) {
        gregDate = {
            month: 2,
            day: 29,
            secondHalfYear: true
        };
    } else if (date.amstrongDay) {
        gregDate = {
            month: 7,
            day: 20,
            secondHalfYear: true
        };
    } else {
        // Do a shallow copy since the object could be changed
        //
        // Lookup table is same for normal year and leap year
        //
        gregDate = Object.assign(
            {},
            lookups.normalYear.tranq[date.month - 1][date.day - 1]
        );
    }

    gregDate.year = toGregYear(date.year);
    if (gregDate.secondHalfYear) {
        gregDate.year++;
    }

    return gregDate;
}

export function getTranqDateStr(date) {
    if (date.aldrinDay) {
        return "Aldrin Day";
    } else if (date.amstrongDay) {
        return "Amstrong Day";
    } else {
        return monthNames[date.month - 1] + " " + date.day;
    }
}

export function getTranqYearStr(year) {
    if (year > 0) {
        return year + " AT";
    } else {
        return year + " BT";
    }
}

function setYearMonth(year, month) {
    $("#month").text(monthNames[month - 1] + ", " + getTranqYearStr(year));
}

function setDay(month, day) {
    $(".calendar-container .cell").removeClass("cell-selected");
    if (!isNaN(day) && day <= 28) {
        $(".calendar-container .cell")
            .filter(function(index) {
                let date = $(this).data();
                return date.month === month && date.day === day;
            })
            .addClass("cell-selected");
    }
}

export function getNextMonth(year, month) {
    return {
        month: month === 13 ? 1 : month + 1,
        year: month === 13 ? (year === -1 ? 1 : year + 1) : year
    };
}

export function getPrevMonth(year, month) {
    return {
        month: month === 1 ? 12 : month - 1,
        year: month === 1 ? (year === 1 ? -1 : year - 1) : year
    };
}

export function getToday() {
    return greg.toTranq(greg.getToday());
}

export function setDate(date) {
    $(".calendar-container .cell").each(function(index) {
        // TODO: Handle aldrin day and amstrong day
        let cellDate = {
            year: date.year,
            month: date.month,
            day: index + 1
        };

        $(this).data(cellDate);
        $(this)
            .find(".cell-value")
            .text(cellDate.day);

        const gregDate = toGreg(cellDate);
        $(this)
            .find("#date")
            .text(greg.getGregDateStr(gregDate));
        $(this)
            .find("#year")
            .text(greg.getGregYearStr(gregDate.year));
    });
    setDay(date.month, date.day);
    setYearMonth(date.year, date.month);
}

export function load() {
    $("#title").text("Tranquility Calendar");
    $(".head-cell").each(function(index) {
        $(this).text(weekDays[index]);
    });
    $(".cell").remove();
    for (let i = 0; i < 28; i++) {
        $(".calendar-container").append(cellString);
    }
}

export const name = "tranq";
