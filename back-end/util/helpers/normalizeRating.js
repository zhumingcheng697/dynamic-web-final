const Timestamp = require("../helpers/Timestamp");

/**
 * Normalizes Timestamps to Date ISOString for client side
 *
 * @param {object} rating
 */
function main(rating) {
  if (rating && rating.postedAt) {
    try {
      rating.postedAt = Timestamp.toISOString(rating.postedAt);
    } catch (e) {
      if (storeErrors) {
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
      rating.updatedAt = Timestamp.toISOString(rating.updatedAt);
    } catch (e) {
      if (storeErrors) {
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
