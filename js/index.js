import * as greg from "./greg.js";
import * as tranq from "./tranq.js";

(function() {
    function highlightDate(year, month) {
        // 'Today' might have changed by now, so get it again,
        let today = cal.parseHash(window.location.hash);

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

    $(window).bind("hashchange", function() {
        init();
    });

    function connect() {
        $(".cell-subtext").click(function() {
            toggleCal(
                $(this)
                    .parents(".cell")
                    .data()
            );
        });
        $(".cell").click(function() {
            date.day = $(this).data().day;
            cal.setDay(date.month, date.day);
            window.location.hash = cal.generateHash(date);
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
        connect();
        cal.setDate(date);
        window.location.hash = cal.generateHash(date);
    }

    function init() {
        // Starts with character '#'
        const hash = window.location.hash.substring(1);
        if (hash.startsWith(greg.name)) {
            cal = greg;
        } else {
            // Default is also tranq
            cal = tranq;
        }

        cal.load();
        connect();

        date = cal.parseHash(hash);
        cal.setDate(date);
    }

    let date;
    let cal;
    init();
})();
