import {
    cellString,
    headCellString,
    lookups,
    tranqToGreg,
    gregToTranq
} from "./common.js";
import Greg from "./greg.js";
import Calendar from "./calendar.js";
import { randomAmstrong } from "./quotes.js";

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
    noOfMonths = 14;
    static name = "tranq";

    constructor(date) {
        super(date);

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
        if (this.showMonth.month === 14) {
            this.setAmstrongDay();
        } else {
            this.setGrid();
            this.setDay();
        }

        this.setYearMonth();
    }

    setAmstrongDay() {
        $(".cell").remove();
        $(".head-cell").remove();

        const cell = $(cellString).appendTo(".calendar-container");
        cell.addClass("single-cell");
        let cellDate = {
            year: this.showMonth.year,
            amstrongDay: true
        };
        cell.data(cellDate);
        cell.find(".cell-value").html(singleCellValue);
        cell.find(".cell-value-main").text(randomAmstrong());
        cell.find(".cell-value-sub").text("- Neil Amstrong");

        this.setGregDate(cell, cellDate);

        this.connectGrid();
    }

    setGregDate(cell, date) {
        const gregDate = tranqToGreg(date);
        cell.find("#date").text(Greg.getDateStr(gregDate));
        cell.find("#year").text(Greg.getYearStr(gregDate.year));
    }

    setGrid() {
        const { year, month } = this.showMonth;

        $(".cell").remove();
        $(".head-cell").remove();

        for (let i = 0; i < 7; i++) {
            const headCell = $(headCellString).appendTo(".calendar-container");
            headCell.text(weekDays[i]);
        }

        for (let i = 0; i < 28; i++) {
            const cell = $(cellString).appendTo(".calendar-container");
            const cellDate = {
                year: year,
                month: month,
                day: i + 1
            };
            cell.data(cellDate);
            cell.find(".cell-value").text(cellDate.day);

            this.setGregDate(cell, cellDate);
        }
        this.connectGrid();
    }

    setYearMonth() {
        const { year, month } = this.showMonth;
        $("#month").text(monthNames[month - 1] + ", " + Tranq.getYearStr(year));
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
