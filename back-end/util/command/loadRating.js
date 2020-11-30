const firebaseHelper = require("../helpers/firebaseHelper");
const normalizeRating = require("../helpers/normalizeRating");

/**
 * Loads a rating with a matching id
 *
 * @param {string} id
 * @param {boolean} normalizeTimestamp
 * @param {boolean} storeErrors
 * @returns {Promise<object>}
 */
async function loadRatingById(
  id,
  normalizeTimestamp = undefined,
  storeErrors = undefined
) {
  if (typeof id !== "string") {
    return {};
  }

  if (typeof normalizeTimestamp === "undefined") {
    normalizeTimestamp = true;
  }

  if (typeof storeErrors === "undefined") {
    storeErrors = false;
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const ratingDoc = await db.collection("ratings").doc(id).get();

      if (ratingDoc && ratingDoc.exists) {
        const rating = ratingDoc.data();

        if (normalizeTimestamp) {
          normalizeRating(rating, storeErrors);
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
