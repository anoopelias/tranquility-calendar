export const cellString = `<div class="cell">
        <div class="cell-value"></div>
        <div class="cell-subtext">
            <div class="cell-sub-inner" id="date"></div>
            <div class="cell-sub-inner" id="year"></div>
        </div>
    </div>`;

export function getLastDateOfMonth(isLeapYear, month) {
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
        for (let j = 1; j <= getLastDateOfMonth(true, i); j++) {
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
