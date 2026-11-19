// Dates and names on the apps' admin and user pages (from BrainBox's and microdraw's
// admin-page.js and user-page.js, 3.5.0)

/**
 * A date as stored (ISO), as text
 * @param {string|Date} date The date
 * @param {Object} [options] The options
 * @param {boolean} [options.time=false] true: 'YYYY-MM-DD HH:MM' (UTC, as stored), else 'YYYY-MM-DD'
 * @returns {string} The date, '' when missing
 */
export const formatDate = (date, { time = false } = {}) => {
  if (!date) { return ''; }

  const text = String(date);

  return time ? text.slice(0, 16).replace('T', ' ') : text.slice(0, 10);
};

/**
 * A number on two digits at least
 * @param {number} n The number
 * @returns {string} The number, padded with '0'
 */
export const pad = (n) => String(n).padStart(2, '0');

/**
 * An ISO date as a local YYYY-MM-DD (dateTime: YYYY-MM-DD HH:MM:SS)
 * @param {string} iso The date
 * @param {boolean} [dateTime=false] true to add the time
 * @returns {string} The local date, '' when missing or not a date
 */
export const localDate = (iso, dateTime = false) => {
  const d = new Date(iso);
  if (!iso || isNaN(d)) {
    return '';
  }
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return dateTime ? `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` : date;
};

/**
 * What a project's Name column shows, and sorts by: its display name, or its shortname
 * when the display name is missing or blank
 * @param {Object} row The project's row
 * @param {Object} [keys] The row's keys
 * @param {string} [keys.nameKey='name'] The display name's key
 * @param {string} [keys.shortnameKey='shortname'] The shortname's key
 * @returns {string} The name shown
 */
export const shownName = (row, { nameKey = 'name', shortnameKey = 'shortname' } = {}) => {
  const name = typeof row[nameKey] === 'string' ? row[nameKey].trim() : '';

  return name === '' ? row[shortnameKey] : row[nameKey];
};
