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
 * @param {boolean} dev
 * @returns {Promise<object[]>}
 */
async function loadRatingsWithMatch(
  key,
  expectedValue,
  beforeMillis = undefined,
  maxAmount = undefined,
  normalizeTimestamp = undefined,
  dev = undefined
) {
  if (typeof beforeMillis === "undefined" || isNaN(beforeMillis)) {
    beforeMillis = Date.now();
  }

  if (typeof maxAmount === "undefined" || isNaN(maxAmount)) {
    maxAmount = 20;
  }

  if (typeof normalizeTimestamp === "undefined") {
    normalizeTimestamp = true;
  }

  if (typeof dev === "undefined") {
    dev = false;
  }

  if (
    typeof key !== "string" ||
    typeof beforeMillis !== "number" ||
    typeof maxAmount !== "number"
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
    return dev ? [{ error: e }] : [];
  }
}

/**
 * Loads ratings with a matching classCode
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} dev
 * @returns {Promise<object[]>}
 */
async function loadRatingsByCode(
  classCode,
  beforeMillis = undefined,
  maxAmount = undefined,
  normalizeTimestamp = undefined,
  dev = undefined
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
    dev
  );
}

/**
 * Loads ratings with a matching classCode
 *
 * @param {string} classCode
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} dev
 * @returns {Promise<object[]>}
 */
async function loadRatingsByStr(
  classCode,
  beforeMillis = undefined,
  maxAmount = undefined,
  normalizeTimestamp = undefined,
  dev = undefined
) {
  return await loadRatingsByCode(
    ClassCode.parse(classCode),
    beforeMillis,
    maxAmount,
    normalizeTimestamp,
    dev
  );
}

/**
 * Loads from a user with a matching uid
 *
 * @param {string} uid
 * @param {number} beforeMillis
 * @param {number} maxAmount
 * @param {boolean} normalizeTimestamp
 * @param {boolean} dev
 * @returns {Promise<object[]>}
 */
async function loadRatingsByUid(
  uid,
  beforeMillis = undefined,
  maxAmount = undefined,
  normalizeTimestamp = undefined,
  dev = undefined
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
    dev
  );
}

module.exports = { loadRatingsByCode, loadRatingsByStr, loadRatingsByUid };
