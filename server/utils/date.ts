export default function dateToLocalISOString(date: Date) {
    const offset = date.getTimezoneOffset();
    const shifted = new Date(date - offset * 60 * 1000);
    return shifted.toISOString().slice(0, -1);
}

export function clearTimeInDate(date: Date) {
    if (!date) {
        return date;
    }
    const clearDate = new Date(date);
    const convertedDate = Date.UTC(
        clearDate.getFullYear(),
        clearDate.getMonth(),
        clearDate.getDate()
    );
    return convertedDate;
}
