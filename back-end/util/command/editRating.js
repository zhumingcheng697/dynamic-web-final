const ClassCode = require("../helpers/ClassCode");
const Timestamp = require("../helpers/Timestamp");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Edits a rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {string} id
 * @param {number} oldEnjoyment
 * @param {number} oldValue
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {number} newEnjoyment
 * @param {number} newValue
 * @param {number} newDifficulty
 * @param {number} newWork
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function editRatingByCodeAndData(
  classCode,
  id,
  oldEnjoyment,
  oldValue,
  oldDifficulty,
  oldWork,
  newEnjoyment,
  newValue,
  newDifficulty,
  newWork,
  instructor = "",
  comment = "",
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
    ![1, 2, 3, 4, 5].includes(oldWork) ||
    ![1, 2, 3, 4, 5].includes(newEnjoyment) ||
    ![1, 2, 3, 4, 5].includes(newValue) ||
    ![1, 2, 3, 4, 5].includes(newDifficulty) ||
    ![1, 2, 3, 4, 5].includes(newWork) ||
    typeof instructor !== "string" ||
    typeof comment !== "string"
  ) {
    return 1;
  }

  const rating = {
    classCode: ClassCode.stringify(classCode),
    enjoyment: newEnjoyment,
    value: newValue,
    difficulty: newDifficulty,
    work: newWork,
    instructor,
    comment,
    updatedAt: Timestamp.now(),
  };

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      await db.collection("ratings").doc(id).update(rating);

      const updateInfo = {};
      const decrementBy1 = firebase.default.firestore.FieldValue.increment(-1);
      const incrementBy1 = firebase.default.firestore.FieldValue.increment(1);

      if (oldEnjoyment !== newEnjoyment) {
        updateInfo[`ratingSummary.enjoyment.${oldEnjoyment}`] = decrementBy1;
        updateInfo[`ratingSummary.enjoyment.${newEnjoyment}`] = incrementBy1;
      }

      if (oldValue !== newValue) {
        updateInfo[`ratingSummary.value.${oldValue}`] = decrementBy1;
        updateInfo[`ratingSummary.value.${newValue}`] = incrementBy1;
      }

      if (oldDifficulty !== newDifficulty) {
        updateInfo[`ratingSummary.difficulty.${oldDifficulty}`] = decrementBy1;
        updateInfo[`ratingSummary.difficulty.${newDifficulty}`] = incrementBy1;
      }

      if (oldWork !== newWork) {
        updateInfo[`ratingSummary.work.${oldWork}`] = decrementBy1;
        updateInfo[`ratingSummary.work.${newWork}`] = incrementBy1;
      }

      if (Object.keys(updateInfo).length) {
        await db
          .collection("classes")
          .doc(ClassCode.stringify(classCode))
          .update(updateInfo);
      }

      return 0;
    });
  } catch (e) {
    return storeErrors ? e : 1;
  }
}

/**
 * Edits a rating
 *
 * @param {string} classCode
 * @param {string} id
 * @param {number} oldEnjoyment
 * @param {number} oldValue
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {number} newEnjoyment
 * @param {number} newValue
 * @param {number} newDifficulty
 * @param {number} newWork
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function editRatingByStrAndData(
  classCode,
  id,
  oldEnjoyment,
  oldValue,
  oldDifficulty,
  oldWork,
  newEnjoyment,
  newValue,
  newDifficulty,
  newWork,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  return await editRatingByCodeAndData(
    ClassCode.parse(classCode),
    id,
    oldEnjoyment,
    oldValue,
    oldDifficulty,
    oldWork,
    newEnjoyment,
    newValue,
    newDifficulty,
    newWork,
    instructor,
    comment,
    storeErrors
  );
}

/**
 * Edits a rating
 *
 * @param {string} id
 * @param {number} newEnjoyment
 * @param {number} newValue
 * @param {number} newDifficulty
 * @param {number} newWork
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function editRatingByIdAndData(
  id,
  newEnjoyment,
  newValue,
  newDifficulty,
  newWork,
  instructor = "",
  comment = "",
  storeErrors = false
) {
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
          enjoyment: oldEnjoyment,
          value: oldValue,
          difficulty: oldDifficulty,
          work: oldWork,
        } = ratingDoc.data();
        return await editRatingByStrAndData(
          classCode,
          id,
          oldEnjoyment,
          oldValue,
          oldDifficulty,
          oldWork,
          newEnjoyment,
          newValue,
          newDifficulty,
          newWork,
          instructor,
          comment,
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
  editRatingByCodeAndData,
  editRatingByStrAndData,
  editRatingByIdAndData,
};
