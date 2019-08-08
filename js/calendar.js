import { tranqToGreg, gregToTranq } from "./common.js";
import Greg from "./greg.js";
import Tranq from "./tranq.js";

function switchDate(cal) {
    const date = $(this)
        .parents(".cell")
        .data();

    if (cal instanceof Tranq) {
        const newDate = tranqToGreg(date);
        setHash(Greg.generateHash(newDate));
    } else {
        const newDate = gregToTranq(date);
        setHash(Tranq.generateHash(newDate));
    }
}

function loadDate(cal) {
    const date = $(this)
        .parents(".cell")
        .data();

    if (cal.equals(date)) {
        switchDate.call(this, cal);
    } else {
        if (cal instanceof Tranq) {
            setHash(Tranq.generateHash(date));
        } else {
            setHash(Greg.generateHash(date));
        }
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
        };
    }

    connectArrows() {
        const self = this;
        $("#next").click(function() {
            self.next();
        });
        $("#previous").click(function() {
            self.prev();
        });
    }

    connectCell(cell) {
        const self = this;
        cell.find(".cell-subtext").click(function() {
            switchDate.call(this, self);
        });
        cell.find(".cell-value").click(function() {
            loadDate.call(this, self);
        });
    }

    connectGrid() {
        const self = this;
        $(".cell:not(.cell-disabled) .cell-subtext").click(function() {
            switchDate.call(this, self);
        });
        $(".cell:not(.cell-disabled) .cell-value").click(function() {
            loadDate.call(this, self);
        });
    }

    showDay() {
        return (
            this.date.year === this.showMonth.year &&
            this.date.month === this.showMonth.month
        );
    }

    getNextMonth() {
        const { year, month } = this.showMonth;
        return {
            month: month === this.noOfMonths ? 1 : month + 1,
            year:
                month === this.noOfMonths ? (year === -1 ? 1 : year + 1) : year
        };
    }

    getPrevMonth() {
        const { year, month } = this.showMonth;
        return {
            month: month === 1 ? this.noOfMonths : month - 1,
            year: month === 1 ? (year === 1 ? -1 : year - 1) : year
        };
    }

    next() {
        this.showMonth = this.getNextMonth();
        this.show();
        this.slideFrom("Left");
    }

    prev() {
        this.showMonth = this.getPrevMonth();
        this.show();
        this.slideFrom("Right");
    }

    slideFrom(direction) {
        // Hacky solution for Firefox. See,
        // https://stackoverflow.com/questions/57372502/restart-css-animation-on-click
        const container = $(".calendar-container");
        let directionClass = "si" + direction;

        if (container.hasClass(directionClass)) {
            directionClass += "2";
        }

        ["siLeft", "siLeft2", "siRight", "siRight2"].forEach(clazz => {
            if (clazz !== directionClass) {
                container.removeClass(clazz);
            }
        });
        container.addClass(directionClass);
    }

    setDay() {
        $(".cell").removeClass("cell-selected");
        if (this.showDay()) {
            const month = this.showMonth.month;
            const day = this.date.day;

            $(".cell")
                .filter(function(index) {
                    let date = $(this).data();
                    return date.month === month && date.day === day;
                })
                .addClass("cell-selected");
        }
    }

    emptyGrid() {
        $(".calendar-container")
            .empty()
            .removeClass("leap-month");
    }

    unload() {
        this.emptyGrid();
        $("#next").unbind();
        $("#previous").unbind();
    }
}
