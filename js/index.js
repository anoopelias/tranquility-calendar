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
        date = tranq.getNextMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        tranq.setDate(date);
    });

    $("#previous").click(function() {
        date = tranq.getPrevMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        tranq.setDate(date);
    });

    function init() {
        tranq.load();
        date = tranq.getToday();
        tranq.setDate(date);
    }

    let date;
    init();
})();
