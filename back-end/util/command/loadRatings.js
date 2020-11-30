const ClassCode = require("../helpers/ClassCode");
const Timestamp = require("../helpers/Timestamp");
const firebaseHelper = require("../helpers/firebaseHelper");
const normalizeRating = require("../helpers/normalizeRating");

/**
 * Loads ratings with a expectedValue at a key
 *
 * @param {string} key
 * @param {any} expectedValue
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} storeErrors
 * @returns {Promise<object[]>}
 */
async function loadRatingsWithMatch(
  key,
  expectedValue,
  beforeMillis = Date.now(),
  maxAmount = 20,
  normalizeTimestamp = true,
  storeErrors = false
) {
  if (
    typeof key !== "string" ||
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
        .where(key, "==", expectedValue)
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

/**
 * Loads ratings with a matching classCode
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} storeErrors
 * @returns {Promise<object[]>}
 */
async function loadRatingsByCode(
  classCode,
  beforeMillis = Date.now(),
  maxAmount = 20,
  normalizeTimestamp = true,
  storeErrors = false
) {
  if (!ClassCode.stringify(classCode)) {
    return [];
  }

  return await loadRatingsWithMatch(
    "classCode",
    ClassCode.stringify(classCode),
    beforeMillis,
    maxAmount,
    normalizeTimestamp,
    storeErrors
  );
}

/**
 * Loads ratings with a matching classCode
 *
 * @param {string} classCode
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} storeErrors
 * @returns {Promise<object[]>}
 */
async function loadRatingsByStr(
  classCode,
  beforeMillis = Date.now(),
  maxAmount = 20,
  normalizeTimestamp = true,
  storeErrors = false
) {
  return await loadRatingsByCode(
    ClassCode.parse(classCode),
    beforeMillis,
    maxAmount,
    normalizeTimestamp,
    storeErrors
  );
}

/**
 * Loads from a user with a matching uid
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
  if (typeof uid !== "string") {
    return [];
  }

  return await loadRatingsWithMatch(
    "uid",
    uid,
    beforeMillis,
    maxAmount,
    normalizeTimestamp,
    storeErrors
  );
}

module.exports = { loadRatingsByCode, loadRatingsByStr, loadRatingsByUid };
