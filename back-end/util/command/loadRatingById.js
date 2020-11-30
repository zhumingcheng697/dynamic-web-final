const Timestamp = require("../helpers/Timestamp");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 *
 * @param {string} id
 * @param {boolean} normalizeTimestamp
 * @param {boolean} storeErrors
 * @returns {Promise<object>}
 */
async function loadRatingById(
  id,
  normalizeTimestamp = true,
  storeErrors = false
) {
  if (typeof id !== "string") {
    return {};
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const ratingDoc = await db.collection("ratings").doc(id).get();

      if (ratingDoc && ratingDoc.exists) {
        const rating = ratingDoc.data();

        if (normalizeTimestamp) {
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

        return rating;
      } else {
        return {};
      }
    });
  } catch (e) {
    return storeErrors ? { error: e } : {};
  }
}

module.exports = loadRatingById;
