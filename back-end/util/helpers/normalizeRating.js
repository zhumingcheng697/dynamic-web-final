const Timestamp = require("../helpers/Timestamp");

/**
 * Normalizes Timestamps to millis for client side
 *
 * @param {object} rating
 * @param {boolean} dev
 */
function main(rating, dev = undefined) {
  if (typeof dev === "undefined") {
    dev = false;
  }

  if (rating && rating.postedAt) {
    try {
      rating.postedAt = Timestamp.toMillis(rating.postedAt);
    } catch (e) {
      if (dev) {
        if (Array.isArray(rating.error)) {
          rating.error.push(e);
        } else {
          rating.error = [e];
        }
      }
    }
  }

  if (rating && rating.updatedAt) {
    try {
      rating.updatedAt = Timestamp.toMillis(rating.updatedAt);
    } catch (e) {
      if (dev) {
        if (Array.isArray(rating.error)) {
          rating.error.push(e);
        } else {
          rating.error = [e];
        }
      }
    }
  }
}

module.exports = main;
