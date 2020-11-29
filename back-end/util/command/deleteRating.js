const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Deletes a rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {string} id
 * @param {boolean} oldRecommend
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {number} oldValue
 * @param {number} oldGrades
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function deleteRatingByCodeAndData(
  classCode,
  id,
  oldRecommend,
  oldDifficulty,
  oldWork,
  oldValue,
  oldGrades,
  storeErrors = false
) {
  if (!ClassCode.stringify(classCode)) {
    return 1;
  }

  if (
    typeof id !== "string" ||
    typeof oldRecommend !== "boolean" ||
    ![1, 2, 3, 4, 5].includes(oldDifficulty) ||
    ![1, 2, 3, 4, 5].includes(oldWork) ||
    ![1, 2, 3, 4, 5].includes(oldValue) ||
    ![1, 2, 3, 4, 5].includes(oldGrades)
  ) {
    return 1;
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      await db.collection("ratings").doc(id).delete();

      const updateInfo = {};
      updateInfo[
        `ratingSummary.recommend.${oldRecommend}`
      ] = firebase.default.firestore.FieldValue.increment(-1);
      updateInfo[
        `ratingSummary.difficulty.${oldDifficulty}`
      ] = firebase.default.firestore.FieldValue.increment(-1);
      updateInfo[
        `ratingSummary.work.${oldWork}`
      ] = firebase.default.firestore.FieldValue.increment(-1);
      updateInfo[
        `ratingSummary.value.${oldValue}`
      ] = firebase.default.firestore.FieldValue.increment(-1);
      updateInfo[
        `ratingSummary.grades.${oldGrades}`
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
 * @param {boolean} oldRecommend
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {number} oldValue
 * @param {number} oldGrades
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function deleteRatingByStrAndData(
  classCode,
  id,
  oldRecommend,
  oldDifficulty,
  oldWork,
  oldValue,
  oldGrades,
  storeErrors = false
) {
  return await deleteRatingByCodeAndData(
    ClassCode.parse(classCode),
    id,
    oldRecommend,
    oldDifficulty,
    oldWork,
    oldValue,
    oldGrades,
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
          recommend,
          difficulty,
          work,
          value,
          grades,
        } = ratingDoc.data();
        return await deleteRatingByStrAndData(
          classCode,
          id,
          recommend,
          difficulty,
          work,
          value,
          grades,
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
