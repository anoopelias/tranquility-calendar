import * as greg from './greg.js';

(function() {

    function highlightDate(year, month) {
        // 'Today' might have changed by now, so get it again,
        let today = greg.getToday();

        if (today.month === month && today.year === year) {
            return today.day;
        }
    }

    $("#next").click(function() {
        date = greg.getNextMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        greg.setDate(date.year, date.month, date.day);
    });

    $("#previous").click(function() {
        date = greg.getPrevMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        greg.setDate(date.year, date.month, date.day);
    });

    function init() {
        greg.load();
        date = greg.getToday();
        greg.setDate(date.year, date.month, date.day);
    }

    let date;
    init();
})();
