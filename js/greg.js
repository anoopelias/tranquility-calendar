import {getTranqDateStr, getTranqYearStr} from "./tranq.js";

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

const weekDays = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
]

function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getLastDateOfMonth(isLeapYear, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            if (isLeapYear) {
                return 29;
            }
            return 28;
    }
}

const gregToTranqLookupTable = generateGregToTranqLookupTable();
const gregToTranqLeapLookupTable = generateGregToTranqLookupTable(true);

function generateGregToTranqLookupTable(isLeapYear) {
    // 01/01 Greg is 25/06 Tranq
    let month = 6;
    let day = 25;
    let nextYear = false;

    const lookup = [];
    for (let i = 1; i <= 12; i++) {
        const months = [];
        for (let j = 1; j <= getLastDateOfMonth(isLeapYear, i); j++) {
            months.push({
                month: month,
                day: day++,
                nextYear: nextYear
            });

            // Amstrong day is last day of the year,
            // so reset month and day
            if (month > 13) {
                months[j - 1].amstrongDay = true;
                month = 1;
                day = 1;
                nextYear = true;
            }

            // Aldrin day is leap day and will not count in its Tranq month,
            // so go back day by 1
            if (isLeapYear && i === 2 && j === 29) {
                months[j - 1].aldrinDay = true;
                day--;
            }

            if (day > 28) {
                day = 1;
                month++;
            }
        }
        lookup.push(months);
    }

    return lookup;
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

    let tranqYear = gregYear - 1969;
    if (gregYear > 1969) {
        tranqYear++;
    }

    return tranqYear;
}

function toTranq(date) {
    let lookupTable;
    if (isLeapYear(date.year)) {
        lookupTable = gregToTranqLeapLookupTable;
    } else {
        lookupTable = gregToTranqLookupTable;
    }
    // Do a shallow copy since the object could be changed
    const tranqDate = Object.assign(
        {},
        lookupTable[date.month - 1][date.day - 1]
    );

    if (tranqDate.nextYear) {
        tranqDate.year = toTranqYear(date.year);
    } else {
        tranqDate.year = toTranqYear(date.year - 1);
    }

    return tranqDate;
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
            .text(getTranqYearStr(tranqDate));
    });
}

function setYearMonth(year, month) {
    $("#month").text(monthNames[month - 1] + " " + year);
}

function setDay(month, day) {
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

export function getToday() {
    let today = new Date();
    return {
        year: 1900 + today.getYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
    };
}

export function setDate(year, month, day) {
    let datesOfMonth = getDatesOfMonth(year, month);
    setCalendarGrid(datesOfMonth);
    setDay(month, day);
    setYearMonth(year, month);
}

export function getNextMonth(year, month) {
    return {
        month: month === 12 ? 1 : month + 1,
        year: month === 12 ? year + 1 : year
    };
}

export function getPrevMonth(year, month) {
    return {
        month: month === 1 ? 12 : month - 1,
        year: month === 1 ? year - 1 : year
    };
}

export function load() {
    const cellString = `<div class="cell">
            <div class="cell-value"></div>
            <div class="cell-subtext">
                <div class="cell-sub-inner" id="date"></div>
                <div class="cell-sub-inner" id="year"></div>
            </div>
        </div>`;

    for (let i = 0; i < 42; i++) {
        $(".calendar-container").append(cellString);
    }

    $(".head-cell").each(function(index) {
        $(this).text(weekDays[index]);
    });
}

