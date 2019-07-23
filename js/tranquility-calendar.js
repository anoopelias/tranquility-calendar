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

    function getLastDateOfMonth(isLeapYear, month) {
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                if (isLeapYear) {
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

    function tranqToGregYear(tranqYear) {
        let gregYear = tranqYear + 1969;
        if (tranqYear >= 1) {
            gregYear--;
        }

        return gregYear;
    }

    const gregToTranqLookupTable = generateGregToTranqLookupTable();
    const gregToTranqLeapLookupTable = generateGregToTranqLookupTable(true);

    function generateGregToTranqLookupTable(isLeapYear) {
        // 01/01 Greg is 25/06 Tranq
        let month = 6;
        let day = 25;
        let nextYear = false;

        const lookup = [];
        for (let i = 1; i <= 12; i++) {
            const months = [];
            for (let j = 1; j <= getLastDateOfMonth(isLeapYear, i); j++) {
                months.push({
                    month: month,
                    day: day++,
                    nextYear: nextYear
                });

                // Amstrong day is last day of the year,
                // so reset month and day
                if (month > 13) {
                    months[j - 1].amstrongDay = true;
                    month = 1;
                    day = 1;
                    nextYear = true;
                }

                // Aldrin day is leap day and will not count in its Tranq month,
                // so go back day by 1
                if (isLeapYear && i === 2 && j === 29) {
                    months[j - 1].aldrinDay = true;
                    day--;
                }

                if (day > 28) {
                    day = 1;
                    month++;
                }
            }
            lookup.push(months);
        }

        return lookup;
    }

    function gregToTranqYear(gregYear) {
        // For year conversion, look at the sample below,
        //
        // 67-68       -2L
        // 68-69       -1
        // 69-70       1
        // 70-71       2
        // 71-72       3L
        // 72-73       4
        // 69-70       5
        // 70-71       6
        // 71-72       7L
        // 72-73       8
        //
        // L - is a leap year
        // Please note that there is no '0' Tranq year
        //

        let tranqYear = gregYear - 1969;
        if (gregYear > 1969) {
            tranqYear++;
        }

        return tranqYear;
    }

    function isTranqLeapYear(tranqYear) {
        // Feb 29 is in the next greg year, hence the '  + 1' below.
        return isLeapYear(gregToTranqYear(tranqYear) + 1);
    }

    function gregToTranq(date) {
        let lookupTable;
        if (isLeapYear(date.year)) {
            lookupTable = gregToTranqLeapLookupTable;
        } else {
            lookupTable = gregToTranqLookupTable;
        }
        // Do a shallow copy since the object could be changed
        const tranqDate = Object.assign(
            {},
            lookupTable[date.month - 1][date.day - 1]
        );

        if (tranqDate.nextYear) {
            tranqDate.year = gregToTranqYear(date.year);
        } else {
            tranqDate.year = gregToTranqYear(date.year - 1);
        }

        return tranqDate;
    }
    function getDatesOfMonth(year, month) {
        const datesOfMonth = [];
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const prevMonth = getPrevMonth(year, month);

        let lastDateOfPrevMonth = getLastDateOfMonth(
            isLeapYear(prevMonth.year),
            prevMonth.month
        );

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

        const lastDateOfThisMonth = getLastDateOfMonth(isLeapYear(year), month);

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
                    day: i++
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
            console.log(
                "Tranquility date",
                gregToTranq(datesOfMonth[index].date)
            );
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
