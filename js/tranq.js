const monthNames = [
    "Archimedes",
    "Brahe",
    "Copernicus",
    "Darwin",
    "Einstein",
    "Faraday",
    "Galileo",
    "Hippocrates",
    "Imhotep",
    "Jung",
    "Kepler",
    "Lavoisier",
    "Mendel"
];

export function toGregYear(tranqYear) {
    let gregYear = tranqYear + 1969;
    if (tranqYear >= 1) {
        gregYear--;
    }

    return gregYear;
}

export function getTranqDateStr(date) {
    if (date.aldrinDay) {
        return "Aldrin Day";
    } else if (date.amstrongDay) {
        return "Amstrong Day";
    } else {
        return monthNames[date.month - 1] + " " + date.day;
    }
}

export function getTranqYearStr(date) {
    if (date.year > 0) {
        return date.year + " AT";
    } else {
        return date.year + " BT";
    }
}

