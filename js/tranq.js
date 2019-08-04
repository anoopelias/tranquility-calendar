import {
    cellString,
    headCellString,
    lookups,
    tranqToGreg,
    gregToTranq,
    tranqToGregYear
} from "./common.js";
import Greg from "./greg.js";
import Calendar from "./calendar.js";
import * as quotes from "./quotes.js";

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
    "Mendel",
    "Amstrong Day"
];

const weekDays = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

const singleCellValue = `<div class="cell-value-main"></div><div class="cell-value-sub"></div>`;

export default class Tranq extends Calendar {
    constructor(date) {
        super(date);
        this.noOfMonths = 14;

        // Amstrong day will be 14th month
        if (this.date.amstrongDay) {
            this.showMonth.month = 14;
        }

        // Aldrin day will be loaded on Hippocrates
        if (this.date.aldrinDay) {
            this.showMonth.month = 8;
        }
    }

    load() {
        $("#title").text("Tranquility Calendar");
        this.connectArrows();
        this.show();
    }

    show() {
        const { year, month } = this.showMonth;

        if (month === 14) {
            this.setAmstrongDay();
        } else {
            this.setGrid();
            this.setYearMonth();
        }

        // In Tranq the leap month is 8 (Hippocrates)
        if (Tranq.isLeapYear(year) && month === 8) {
            if (this.date.year === year && this.date.aldrinDay) {
                this.showAldrinDay();
            } else {
                this.showAldrinButton();
            }
        }

        this.setDay();
    }

    setAmstrongDay() {
        this.emptyGrid();

        const cell = $(cellString)
            .appendTo(".calendar-container")
            .addClass("single-cell")
            .data({
                year: this.showMonth.year,
                amstrongDay: true
            });
        cell.find(".cell-value").html(singleCellValue);
        cell.find(".cell-value-sub").text("- Neil Amstrong");

        if (this.showMonth.year === -1) {
            // Moon landing day
            cell.find(".cell-value-main").text(quotes.moonLanding);
            $("#month").text("Moon Landing Day");
        } else {
            cell.find(".cell-value-main").text(quotes.randomAmstrong());
            this.setYearMonth();
        }

        this.setGregDate(cell);
        this.connectCell(cell);
    }

    showAldrinDay() {
        // Insert AldrinDay cell
        const cell = $(cellString)
            .insertAfter(".cell:eq(26)")
            .data({ ...this.showMonth, aldrinDay: true })
            .addClass("aldrin-day");

        cell.find(".cell-value").text("Aldrin Day");

        this.setGregDate(cell);
        this.connectCell(cell);
    }

    showAldrinButton() {
        const self = this;
        $(`<div class="aldrin-day-button">Aldrin Day</div>`)
            .appendTo(".cell:eq(26)")
            .click(function() {
                $(this).hide();
                self.showAldrinDay();
            });
    }

    setGregDate(cell) {
        const gregDate = tranqToGreg(cell.data());
        cell.find("#date").text(Greg.getDateStr(gregDate));
        cell.find("#year").text(Greg.getYearStr(gregDate.year));
    }

    setGrid() {
        const { year, month } = this.showMonth;

        this.emptyGrid();
        for (let i = 0; i < 7; i++) {
            $(headCellString)
                .appendTo(".calendar-container")
                .text(weekDays[i]);
        }

        for (let i = 0; i < 28; i++) {
            const date = {
                year: year,
                month: month,
                day: i + 1
            };
            const cell = $(cellString)
                .appendTo(".calendar-container")
                .data(date);
            cell.find(".cell-value").text(date.day);
            this.setGregDate(cell);
            this.connectCell(cell);
        }
    }

    setYearMonth() {
        const { year, month } = this.showMonth;
        $("#month").text(monthNames[month - 1] + ", " + Tranq.getYearStr(year));
    }

    setDay() {
        super.setDay();
        if (
            this.date.aldrinDay &&
            this.date.year === this.showMonth.year &&
            this.showMonth.month === 8
        ) {
            $(".cell:eq(27)").addClass("cell-selected");
        }
    }

    showDay() {
        return (
            super.showDay() ||
            (this.date.amstrongDay &&
                this.date.year === this.showMonth.year &&
                this.showMonth.month === 14)
        );
    }

    parseHash(hash) {
        const splits = hash.split("_");
        const date = (this.date = {});
        date.year = parseInt(splits[1]);

        if (isNaN(date.year)) {
            this.date = Tranq.getToday();
        }

        if (splits[2] === "aldrin") {
            date.aldrinDay = true;
        } else if (splits[2] === "amstrong") {
            date.amstrongDay = true;
        } else {
            date.month = parseInt(splits[2]);
            if (isNaN(date.month)) {
                this.date = Tranq.getToday();
            }

            date.day = parseInt(splits[3]);
            if (isNaN(date.day)) {
                // If day is not there, we should load month
                date.day = undefined;
            }
        }
    }

    equals(date) {
        if (this.date.year !== date.year) {
            return false;
        } else if (this.date.amstrongDay && date.amstrongDay) {
            return true;
        } else if (this.date.aldrinDay && date.aldrinDay) {
            return true;
        } else if (this.date.month !== date.month) {
            return false;
        } else if (this.date.day !== date.day) {
            return false;
        }

        return true;
    }

    // Fields are not supported in Firefox yet
    static get name() {
        return "tranq";
    }

    static isLeapYear(year) {
        // Since Tranq year is July to July, it is a leap
        // year if the next Greg year is a leap year.
        return Greg.isLeapYear(tranqToGregYear(year) + 1);
    }

    static generateHash(date) {
        let hash = Tranq.name + "_" + date.year + "_";
        if (date.aldrinDay) {
            hash += "aldrin";
        } else if (date.amstrongDay) {
            hash += "amstrong";
        } else {
            hash += date.month + "_" + date.day;
        }

        return hash;
    }

    static getDateStr(date) {
        if (date.aldrinDay) {
            return "Aldrin Day";
        } else if (date.amstrongDay) {
            return "Amstrong Day";
        } else {
            return monthNames[date.month - 1] + " " + date.day;
        }
    }

    static getYearStr(year) {
        if (year > 0) {
            return year + " AT";
        } else {
            return -year + " BT";
        }
    }

    static getToday() {
        return gregToTranq(Greg.getToday());
    }
}
