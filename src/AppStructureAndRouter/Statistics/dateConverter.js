export const createDateFromTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    const options = {formatMatcher: 'basic', year: 'numeric', month: 'long', day: 'numeric'};
    const date = `${dateObj.toLocaleString('en-GB', options)}`;
    return date;
}
