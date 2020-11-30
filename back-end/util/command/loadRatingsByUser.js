const Timestamp = require("../helpers/Timestamp");
const firebaseHelper = require("../helpers/firebaseHelper");
const normalizeRating = require("../helpers/normalizeRating");

/**
 * Loads ratings from a user with the matching uid
 *
 * @param {string} uid
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} storeErrors
 * @returns {Promise<object[]>}
 */
async function loadRatingsByUid(
  uid,
  beforeMillis = Date.now(),
  maxAmount = 20,
  normalizeTimestamp = true,
  storeErrors = false
) {
  if (
    typeof uid !== "string" ||
    typeof beforeMillis !== "number" ||
    isNaN(beforeMillis)
  ) {
    return [];
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const ratingDocs = await db
        .collection("ratings")
        .where("uid", "==", uid)
        .where("postedAt", "<", Timestamp.fromMillis(beforeMillis))
        .orderBy("postedAt", "desc")
        .limit(maxAmount)
        .get();

      const ratings = [];

      ratingDocs.forEach((ratingDoc) => {
        if (ratingDoc && ratingDoc.exists) {
          const rating = ratingDoc.data();
          rating.id = ratingDoc.id;

          if (normalizeTimestamp) {
            normalizeRating(rating);
          }

          ratings.push(rating);
        }
      });

      return ratings;
    });
  } catch (e) {
    return storeErrors ? [{ error: e }] : [];
  }
}

module.exports = loadRatingsByUid;
