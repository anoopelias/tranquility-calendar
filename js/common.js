export const cellString = `<div class="cell">
        <div class="cell-value"></div>
        <div class="cell-subtext">
            <div class="cell-sub-inner" id="date"></div>
            <div class="cell-sub-inner" id="year"></div>
        </div>
    </div>`;

export const headCellString = "<div class='head-cell'></div>";

export function getLastDayOfMonth(isLeapYear, month) {
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

export const lookups = generateGregTranqLookupTables();

function generateGregTranqLookupTables() {
    // 01/01 Greg is 25/06 Tranq
    let month = 6;
    let day = 25;
    let secondHalfYear = false;

    // FIXME: This has become more complicated than necessary! :(
    const gregLookup = [];
    const tranqLookup = [];
    for (let i = 0; i < 14; i++) {
        tranqLookup[i] = [];
    }

    for (let i = 1; i <= 12; i++) {
        const months = [];
        for (let j = 1; j <= getLastDayOfMonth(true, i); j++) {
            tranqLookup[month - 1][day - 1] = {
                month: i,
                day: j,
                secondHalfYear: !secondHalfYear
            };

            months.push({
                month: month,
                day: day++,
                secondHalfYear: secondHalfYear
            });

            // Amstrong day is last day of the year,
            // so reset month and day
            if (month > 13) {
                months[j - 1].amstrongDay = true;
                months[j - 1].month = 13;
                month = 1;
                day = 1;
                secondHalfYear = true;
            }

            // Aldrin day is leap day and will not count in its Tranq month,
            // so go back day by 1
            if (i === 2 && j === 29) {
                months[j - 1].aldrinDay = true;
                day--;
            }

            if (day > 28) {
                day = 1;
                month++;
            }
        }
        gregLookup.push(months);
    }

    return {
        greg: gregLookup,
        tranq: tranqLookup
    };
}

function tranqToGregYear(tranqYear) {
    // For year conversion, look at the sample below,
    //
    // Strart       End
    // 21 Jul 67 to 20 Jul 68       -2L
    // 21 Jul 68 to 20 Jul 69       -1
    // 21 Jul 69 to 20 Jul 70       1
    // 21 Jul 70 to 20 Jul 71       2
    // 21 Jul 71 to 20 Jul 72       3L
    //
    // This function returns the Gregorian year as of
    // new year of the input Tranquility year
    //
    // Input        Output
    // -2           1967
    // -1           1968
    // 1            1969
    // 2            1970
    //

    let gregYear = tranqYear + 1969;
    if (tranqYear >= 1) {
        gregYear--;
    }

    return gregYear;
}

export function tranqToGreg(date) {
    let lookupTable;
    let gregDate;

    if (date.aldrinDay) {
        gregDate = {
            month: 2,
            day: 29,
            secondHalfYear: true
        };
    } else if (date.amstrongDay) {
        gregDate = {
            month: 7,
            day: 20,
            secondHalfYear: true
        };
    } else {
        // Do a shallow copy since the object could be changed
        //
        // Lookup table is same for normal year and leap year
        //
        gregDate = Object.assign(
            {},
            lookups.tranq[date.month - 1][date.day - 1]
        );
    }

    gregDate.year = tranqToGregYear(date.year);
    if (gregDate.secondHalfYear) {
        gregDate.year++;
    }

    return gregDate;
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
    // Output Tranquility year is the year when the input Gregorian year ends.
    //

    let tranqYear = gregYear - 1969;
    if (gregYear >= 1969) {
        tranqYear++;
    }

    return tranqYear;
}

export function gregToTranq(date) {
    // Do a shallow copy since the object could be changed
    const tranqDate = Object.assign(
        {},
        lookups.greg[date.month - 1][date.day - 1]
    );

    tranqDate.year = gregToTranqYear(date.year);
    if (!tranqDate.secondHalfYear) {
        tranqDate.year = tranqDate.year === 1 ? -1 : tranqDate.year - 1;
    }

    return tranqDate;
}
