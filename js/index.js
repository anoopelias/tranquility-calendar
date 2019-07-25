import * as greg from "./greg.js";
import * as tranq from "./tranq.js";

(function() {
    function highlightDate(year, month) {
        // 'Today' might have changed by now, so get it again,
        let today = tranq.getToday();

        if (today.month === month && today.year === year) {
            return today.day;
        }
    }

    $("#next").click(function() {
        date = cal.getNextMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        cal.setDate(date);
    });

    $("#previous").click(function() {
        date = cal.getPrevMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        cal.setDate(date);
    });

    function connect() {
        $(".cell-subtext").click(function() {
            const newDate = $(this)
                .parents(".cell")
                .data();
            toggleCal(newDate);
        });
    }

    function toggleCal(newDate) {
        if (cal.name === "tranq") {
            date = tranq.toGreg(newDate);
            cal = greg;
        } else {
            date = greg.toTranq(newDate);
            cal = tranq;
        }
        cal.load();
        cal.setDate(date);
        connect();
    }

    function init() {
        cal = tranq;
        cal.load();
        connect();
        date = cal.getToday();
        cal.setDate(date);
    }

    let date;
    let cal;
    init();
})();
