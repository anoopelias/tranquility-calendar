import * as greg from "./greg.js";
import * as tranq from "./tranq.js";

function switchPage(cal, date) {
    if (cal instanceof tranq.Tranq) {
        const newDate = tranq.toGreg(date);
        setHash(greg.Greg.generateHash(newDate));
    } else {
        const newDate = greg.toTranq(date);
        setHash(tranq.Tranq.generateHash(newDate));
    }
}

function setPage(cal, date) {
    if (cal instanceof tranq.Tranq) {
        setHash(tranq.Tranq.generateHash(date));
    } else {
        setHash(greg.Greg.generateHash(date));
    }
}

function setHash(hash) {
    window.location.hash = hash;
}

export default class Calendar {
    constructor(date) {

        if (typeof date === "string") {
            this.parseHash(date);
        } else {
            this.date = date;
        }

        this.showMonth = {
            month: this.date.month,
            year: this.date.year
        }
    }

    connect() {
        const that = this;
        $(".cell-subtext").click(function() {
            const date = $(this).parents(".cell").data();
            switchPage(that, date);
        });
        $(".cell-value").click(function() {
            const date = $(this).parents(".cell").data();
            setPage(that, date);
        });
        $("#next").click(function() {
            that.next();
        });
        $("#previous").click(function() {
            that.prev();
        });
    }

    setShow() {
        this.show = {
            month: this.date.month,
            year: this.date.year
        }
    }

    showDay() {
        const {year, month} = this.showMonth;
        return this.date.year === year && this.date.month === month;
    }

    getNextMonth() {
        const {year, month} = this.showMonth;
        return {
            month: month === this.noOfMonths ? 1 : month + 1,
            year: month === this.noOfMonths ? (year === -1 ? 1 : year + 1) : year
        };
    }

    getPrevMonth() {
        const {year, month} = this.showMonth;
        return {
            month: month === 1 ? this.noOfMonths : month - 1,
            year: month === 1 ? (year === 1 ? -1 : year - 1) : year
        };
    }

    next() {
        this.showMonth = this.getNextMonth();
        this.show();
    }

    prev() {
        this.showMonth = this.getPrevMonth();
        this.show();
    }

    setDay() {
        $(".calendar-container .cell").removeClass("cell-selected");
        if (this.showDay()) {
            const month = this.showMonth.month;
            const day = this.date.day;

            $(".calendar-container .cell")
                .filter(function(index) {
                    let date = $(this).data();
                    return date.month === month && date.day === day;
                })
                .addClass("cell-selected");
        }
    }

    unload() {
        $(".cell").remove();
        $("#next").unbind();
        $("#previous").unbind();
    }

}
