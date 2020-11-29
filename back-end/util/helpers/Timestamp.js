const Timestamp = require("firebase").default.firestore.Timestamp;

/**
 * Creates a Timestamp from a Date
 *
 * @param {Date} date
 * @returns {firebase.default.firestore.Timestamp}
 */
function fromDate(date) {
  return Timestamp.fromDate(date);
}

/**
 * Creates a Timestamp from a Date
 *
 * @param {firebase.default.firestore.Timestamp} timestamp
 * @returns {Date}
 */
function toDate(timestamp) {
  return timestamp.toDate();
}

/**
 * Creates a Timestamp from ISO String
 *
 * @param {string} ISOString
 * @returns {firebase.default.firestore.Timestamp}
 */
function fromISOString(ISOString) {
  return fromDate(new Date(ISOString));
}

/**
 * Creates a Timestamp from ISO String
 *
 * @param {firebase.default.firestore.Timestamp} timestamp
 * @returns {string}
 */
function toISOString(timestamp) {
  return toDate(timestamp).toISOString();
}

/**
 * Creates a Timestamp using current time
 *
 * @returns {firebase.default.firestore.Timestamp}
 */
function now() {
  return Timestamp.now();
}

module.exports = { fromDate, toDate, fromISOString, toISOString, now };
