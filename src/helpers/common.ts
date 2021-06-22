export function isDefinedNotNull(variable): boolean {
    return typeof variable !== 'undefined' && variable !== null;
}

export function isDefinedNotNullNotEmpty(variable): boolean {
    return typeof variable !== 'undefined' && variable !== null && variable.trim() != '';
}

export function formatMoney(value, thousandSeparator = ','): string {
    return value.toLocaleString('en').replace(/,/g, thousandSeparator);
}

export function range(start = 1, end = 1, step = 1) {
    let rangeValues = [];

    for (let i = start; i <= end; i += step) {
        rangeValues.push(i);
    }

    return rangeValues;
}