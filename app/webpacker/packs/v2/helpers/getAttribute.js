/**
 * Function that returns a string with a space and the provided value if it exists, or an empty string if it is falsy.
 * @param {string} value - The value to be included in the resulting string.
 * @returns {string} - The resulting string.
 */
const GetAttribute = (value) => (value ? ` ${value}` : '');

export default GetAttribute;
