export default function dateToLocalISOString(date: Date) {
    const offset = date.getTimezoneOffset();
    const shifted = new Date(date - offset * 60 * 1000);
    return shifted.toISOString().slice(0, -1);
}
