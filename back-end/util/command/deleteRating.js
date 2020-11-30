const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");
const loadRating = require("./loadRating");

/**
 * Deletes a rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {string} id
 * @param {number} oldEnjoyment
 * @param {number} oldValue
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function deleteRatingByCodeAndData(
  classCode,
  id,
  oldEnjoyment,
  oldValue,
  oldDifficulty,
  oldWork,
  storeErrors = false
) {
  if (!ClassCode.stringify(classCode)) {
    return 1;
  }

  if (
    typeof id !== "string" ||
    ![1, 2, 3, 4, 5].includes(oldEnjoyment) ||
    ![1, 2, 3, 4, 5].includes(oldValue) ||
    ![1, 2, 3, 4, 5].includes(oldDifficulty) ||
    ![1, 2, 3, 4, 5].includes(oldWork)
  ) {
    return 1;
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      await db.collection("ratings").doc(id).delete();

      const updateInfo = {};
      const decrementBy1 = firebase.default.firestore.FieldValue.increment(-1);
      updateInfo[`ratingSummary.enjoyment.${oldEnjoyment}`] = decrementBy1;
      updateInfo[`ratingSummary.value.${oldValue}`] = decrementBy1;
      updateInfo[`ratingSummary.difficulty.${oldDifficulty}`] = decrementBy1;
      updateInfo[`ratingSummary.work.${oldWork}`] = decrementBy1;

      await db
        .collection("classes")
        .doc(ClassCode.stringify(classCode))
        .update(updateInfo);

      return 0;
    });
  } catch (e) {
    return storeErrors ? e : 1;
  }
}

/**
 * Deletes a rating
 *
 * @param {string} classCode
 * @param {string} id
 * @param {number} oldEnjoyment
 * @param {number} oldValue
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function deleteRatingByStrAndData(
  classCode,
  id,
  oldEnjoyment,
  oldValue,
  oldDifficulty,
  oldWork,
  storeErrors = false
) {
  return await deleteRatingByCodeAndData(
    ClassCode.parse(classCode),
    id,
    oldEnjoyment,
    oldValue,
    oldDifficulty,
    oldWork,
    storeErrors
  );
}

/**
 * Deletes a rating
 *
 * @param {string} id
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function deleteRatingById(id, storeErrors = false) {
  if (typeof id !== "string") {
    return 1;
  }

  try {
    const { classCode, enjoyment, value, difficulty, work } = await loadRating(
      id,
      false
    );

    return await deleteRatingByStrAndData(
      classCode,
      id,
      enjoyment,
      value,
      difficulty,
      work,
      storeErrors
    );
  } catch (e) {
    return storeErrors ? e : 1;
  }
}

module.exports = {
  deleteRatingByCodeAndData,
  deleteRatingByStrAndData,
  deleteRatingById,
};
