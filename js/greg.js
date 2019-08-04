import {
    cellString,
    getLastDayOfMonth,
    lookups,
    gregToTranq,
    headCellString
} from "./common.js";
import Tranq from "./tranq.js";
import Calendar from "./calendar.js";

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

export default class Greg extends Calendar {
    constructor(date) {
        super(date);
        this.noOfMonths = 12;
    }

    load() {
        this.loadPage();
        this.connectArrows();
        this.connectGrid();
        this.show();
    }

    loadPage() {
        $("#title").text("Gregorian Calendar");
        for (let i = 0; i < 7; i++) {
            $(".calendar-container").append(headCellString);
        }
        $(".head-cell").each(function(index) {
            $(this).text(weekDays[index]);
        });
        for (let i = 0; i < 42; i++) {
            $(".calendar-container").append(cellString);
        }
    }

    show() {
        let datesOfMonth = this.getDatesOfMonth();
        this.setGrid(datesOfMonth);
        this.setDay();
        this.setYearMonth();
    }

    getDatesOfMonth() {
        const datesOfMonth = [];
        const { year, month } = this.showMonth;
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const prevMonth = this.getPrevMonth();

        let lastDateOfPrevMonth = getLastDayOfMonth(
            Greg.isLeapYear(prevMonth.year),
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

        const lastDateOfThisMonth = getLastDayOfMonth(
            Greg.isLeapYear(year),
            month
        );

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

        const nextMonth = this.getNextMonth();
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

    setGrid(datesOfMonth) {
        $(".calendar-container .cell").removeClass("cell-disabled");
        $(".calendar-container .cell").each(function(index) {
            const cell = $(this);
            cell.data(datesOfMonth[index].date);
            cell.find(".cell-value").text(datesOfMonth[index].date.day);

            if (!datesOfMonth[index].selectable) {
                cell.addClass("cell-disabled");
            }

            const tranqDate = gregToTranq(datesOfMonth[index].date);
            cell.find("#date").text(Tranq.getDateStr(tranqDate));
            cell.find("#year").text(Tranq.getYearStr(tranqDate.year));
        });
    }

    setYearMonth() {
        const { year, month } = this.showMonth;
        $("#month").text(monthNames[month - 1] + ", " + Greg.getYearStr(year));
    }

    parseHash(hash) {
        const splits = hash.split("_");
        const date = (this.date = {});
        date.year = parseInt(splits[1]);

        if (isNaN(date.year)) {
            this.date = Greg.getToday();
        }

        date.month = parseInt(splits[2]);
        if (isNaN(date.month)) {
            this.date = Greg.getToday();
        }

        date.day = parseInt(splits[3]);
        if (isNaN(date.day)) {
            // If day is not there, we should load month
            date.day = undefined;
        }
    }

    equals(date) {
        if (this.date.year !== date.year) {
            return false;
        } else if (this.date.month !== date.month) {
            return false;
        } else if (this.date.day !== date.day) {
            return false;
        }

        return true;
    }

    static get name() {
        return "greg";
    }

    static isLeapYear(year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

    static generateHash(date) {
        return Greg.name + "_" + date.year + "_" + date.month + "_" + date.day;
    }

    static getDateStr(date) {
        return monthNames[date.month - 1] + " " + date.day;
    }

    static getYearStr(year) {
        if (year < 1000 && year > 0) {
            return year + " AD";
        } else if (year < 0) {
            return -year + " BC";
        }

        return year + "";
    }

    static getToday() {
        let today = new Date();
        return {
            year: 1900 + today.getYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };
    }
}
