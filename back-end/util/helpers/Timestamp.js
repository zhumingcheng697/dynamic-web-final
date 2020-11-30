const Timestamp = require("firebase").default.firestore.Timestamp;

/**
 * Converts a Date to a Timestamp
 *
 * @param {Date} date
 * @returns {firebase.default.firestore.Timestamp}
 */
function fromDate(date) {
  return Timestamp.fromDate(date);
}

/**
 * Converts a Timestamp to a Date
 *
 * @param {firebase.default.firestore.Timestamp} timestamp
 * @returns {Date}
 */
function toDate(timestamp) {
  return timestamp.toDate();
}

/**
 * Converts millis to a Timestamp
 *
 * @param {number} millis
 * @returns {firebase.default.firestore.Timestamp}
 */
function fromMillis(millis) {
  return Timestamp.fromMillis(millis);
}

/**
 * Converts a Timestamp to millis
 *
 * @param {firebase.default.firestore.Timestamp} timestamp
 * @returns {number}
 */
function toMillis(timestamp) {
  return timestamp.toMillis();
}

/**
 * Creates a Timestamp using current time
 *
 * @returns {firebase.default.firestore.Timestamp}
 */
function now() {
  return Timestamp.now();
}

module.exports = { fromDate, toDate, fromMillis, toMillis, now };
