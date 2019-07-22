(function() {
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

    function getLastDateOfMonth(year, month) {
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
                break;
            case 2:
                if (isLeapYear(year)) {
                    return 29;
                }
                return 28;
        }
    }

    function isLeapYear(year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

    function getPrevMonth(year, month) {
        return {
            month: month === 1 ? 12 : month - 1,
            year: month === 1 ? year - 1 : year
        };
    }

    function getNextMonth(year, month) {
        return {
            month: month === 12 ? 1 : month + 1,
            year: month === 12 ? year + 1 : year
        };
    }

    function getDatesOfMonth(year, month) {
        const datesOfMonth = [];
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const prevMonth = getPrevMonth(year, month);

        let lastDateOfPrevMonth = getLastDateOfMonth(prevMonth.year, prevMonth.month);

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

        const lastDateOfThisMonth = getLastDateOfMonth(year, month);

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

        const nextMonth = getNextMonth(year, month);
        let i = 1;
        while (datesOfMonth.length <= 42) {
            datesOfMonth.push({
                date: {
                    year: nextMonth.year,
                    month: nextMonth.month,
                    day: i++,
                },
                selectable: false
            });
        }

        return datesOfMonth;
    }

    function setCalendarGrid(datesOfMonth) {
        $(".calendar-container .cell").removeClass("cell-disabled");
        $(".calendar-container .cell").each(function(index) {
            $(this).text(datesOfMonth[index].date.day);
            if (!datesOfMonth[index].selectable) {
                $(this).addClass("cell-disabled");
            }
        });
    }

    function setDay(day, datesOfMonth) {
        $(".calendar-container .cell").removeClass("cell-selected");
        if (!isNaN(day) && day <= 42) {
            $(".calendar-container .cell")
                .filter(function(index) {
                    return (
                        $(this).text() == day && datesOfMonth[index].selectable
                    );
                })
                .addClass("cell-selected");
        }
    }

    function setYearMonth(year, month) {
        $("#month").text(monthNames[month - 1] + " " + year);
    }

    function setDate(year, month, day) {
        let datesOfMonth = getDatesOfMonth(year, month);
        setCalendarGrid(datesOfMonth);
        setDay(day, datesOfMonth);
        setYearMonth(year, month);
    }

    function getToday() {
        let today = new Date();
        return {
            year: 1900 + today.getYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };
    }

    function highlightDate(year, month) {
        // 'Today' might have changed by now, so get it again,
        let today = getToday();

        if (today.month === month && today.year === year) {
            return today.day;
        }
    }

    $("#next").click(function() {
        date = getNextMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        setDate(date.year, date.month, date.day);
    });

    $("#previous").click(function() {
        date = getPrevMonth(date.year, date.month);
        date.day = highlightDate(date.year, date.month);
        setDate(date.year, date.month, date.day);
    });

    function init() {
        // Add all cells
        for (let i = 0; i < 42; i++) {
            $(".calendar-container").append("<div class='cell'></div>");
        }
        date = getToday();
        setDate(date.year, date.month, date.day);
    }

    let date;
    init();
})();
