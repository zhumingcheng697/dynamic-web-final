const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");

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

      updateInfo[
        `ratingSummary.enjoyment.${oldEnjoyment}`
      ] = firebase.default.firestore.FieldValue.increment(-1);

      updateInfo[
        `ratingSummary.value.${oldValue}`
      ] = firebase.default.firestore.FieldValue.increment(-1);

      updateInfo[
        `ratingSummary.difficulty.${oldDifficulty}`
      ] = firebase.default.firestore.FieldValue.increment(-1);

      updateInfo[
        `ratingSummary.work.${oldWork}`
      ] = firebase.default.firestore.FieldValue.increment(-1);

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
  try {
    if (typeof id !== "string") {
      return 1;
    }

    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const ratingDoc = await db.collection("ratings").doc(id).get();

      if (ratingDoc && ratingDoc.exists) {
        const {
          classCode,
          enjoyment,
          value,
          difficulty,
          work,
        } = ratingDoc.data();
        return await deleteRatingByStrAndData(
          classCode,
          id,
          enjoyment,
          value,
          difficulty,
          work,
          storeErrors
        );
      } else {
        return 1;
      }
    });
  } catch (e) {
    return storeErrors ? e : 1;
  }
}

module.exports = {
  deleteRatingByCodeAndData,
  deleteRatingByStrAndData,
  deleteRatingById,
};
