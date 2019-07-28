import { cellString, lookups, tranqToGreg, gregToTranq } from "./common.js";
import Greg from "./greg.js";
import Calendar from "./calendar.js";

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

export default class Tranq extends Calendar {
    noOfMonths = 13;
    static name = "tranq";

    constructor(date) {
        super(date);

        // Amstrong day will be loaded on Mendel
        if (this.date.amstrongDay) {
            this.showMonth.month = 13;
        }

        // Aldrin day will be loaded on Mendel
        if (this.date.aldrinDay) {
            this.showMonth.month = 8;
        }
    }

    load() {
        this.loadPage();
        this.connect();
        this.show();
    }

    loadPage() {
        $("#title").text("Tranquility Calendar");
        $(".head-cell").each(function(index) {
            $(this).text(weekDays[index]);
        });
        for (let i = 0; i < 28; i++) {
            $(".calendar-container").append(cellString);
        }
    }

    show() {
        this.setGrid();
        this.setDay();
        this.setYearMonth();
    }

    setGrid() {
        const { year, month } = this.showMonth;

        $(".calendar-container .cell").each(function(index) {
            // TODO: Handle aldrin day and amstrong day
            let cellDate = {
                year: year,
                month: month,
                day: index + 1
            };

            $(this).data(cellDate);
            $(this)
                .find(".cell-value")
                .text(cellDate.day);

            const gregDate = tranqToGreg(cellDate);
            $(this)
                .find("#date")
                .text(Greg.getDateStr(gregDate));
            $(this)
                .find("#year")
                .text(Greg.getYearStr(gregDate.year));
        });
    }

    setYearMonth() {
        const { year, month } = this.showMonth;
        $("#month").text(monthNames[month - 1] + ", " + Tranq.getYearStr(year));
    }

    parseHash(hash) {
        const splits = hash.split("_");
        const date = (this.date = {});
        date.year = parseInt(splits[1]);

        if (isNaN(date.year)) {
            this.date = Greg.getToday();
        }

        if (splits[2] === "aldrin") {
            date.aldrinDay = true;
        } else if (splits[2] === "amstrong") {
            date.amstrongDay = true;
        } else {
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
