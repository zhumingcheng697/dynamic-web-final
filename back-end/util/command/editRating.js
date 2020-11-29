const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Edits a rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {string} id
 * @param {boolean} oldRecommend
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {number} oldValue
 * @param {number} oldGrades
 * @param {boolean} newRecommend
 * @param {number} newDifficulty
 * @param {number} newWork
 * @param {number} newValue
 * @param {number} newGrades
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function editRatingByCodeAndData(
  classCode,
  id,
  oldRecommend,
  oldDifficulty,
  oldWork,
  oldValue,
  oldGrades,
  newRecommend,
  newDifficulty,
  newWork,
  newValue,
  newGrades,
  instructor = "",
  comment = "",
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
    ![1, 2, 3, 4, 5].includes(oldGrades) ||
    typeof newRecommend !== "boolean" ||
    ![1, 2, 3, 4, 5].includes(newDifficulty) ||
    ![1, 2, 3, 4, 5].includes(newWork) ||
    ![1, 2, 3, 4, 5].includes(newValue) ||
    ![1, 2, 3, 4, 5].includes(newGrades) ||
    typeof instructor !== "string" ||
    typeof comment !== "string"
  ) {
    return 1;
  }

  const rating = {
    classCode: ClassCode.stringify(classCode),
    recommend: newRecommend,
    difficulty: newDifficulty,
    work: newWork,
    value: newValue,
    grades: newGrades,
    instructor,
    comment,
  };

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      rating["updatedAt"] = firebase.default.firestore.Timestamp.fromDate(
        new Date()
      );

      await db.collection("ratings").doc(id).update(rating);

      const updateInfo = {};

      if (oldRecommend !== newRecommend) {
        updateInfo[
          `ratingSummary.recommend.${oldRecommend}`
        ] = firebase.default.firestore.FieldValue.increment(-1);
        updateInfo[
          `ratingSummary.recommend.${newRecommend}`
        ] = firebase.default.firestore.FieldValue.increment(1);
      }

      if (oldDifficulty !== newDifficulty) {
        updateInfo[
          `ratingSummary.difficulty.${oldDifficulty}`
        ] = firebase.default.firestore.FieldValue.increment(-1);
        updateInfo[
          `ratingSummary.difficulty.${newDifficulty}`
        ] = firebase.default.firestore.FieldValue.increment(1);
      }

      if (oldWork !== newWork) {
        updateInfo[
          `ratingSummary.work.${oldWork}`
        ] = firebase.default.firestore.FieldValue.increment(-1);
        updateInfo[
          `ratingSummary.work.${newWork}`
        ] = firebase.default.firestore.FieldValue.increment(1);
      }

      if (oldValue !== newValue) {
        updateInfo[
          `ratingSummary.value.${oldValue}`
        ] = firebase.default.firestore.FieldValue.increment(-1);
        updateInfo[
          `ratingSummary.value.${newValue}`
        ] = firebase.default.firestore.FieldValue.increment(1);
      }

      if (oldGrades !== newGrades) {
        updateInfo[
          `ratingSummary.grades.${oldGrades}`
        ] = firebase.default.firestore.FieldValue.increment(-1);
        updateInfo[
          `ratingSummary.grades.${newGrades}`
        ] = firebase.default.firestore.FieldValue.increment(1);
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
 * @param {boolean} oldRecommend
 * @param {number} oldDifficulty
 * @param {number} oldWork
 * @param {number} oldValue
 * @param {number} oldGrades
 * @param {boolean} newRecommend
 * @param {number} newDifficulty
 * @param {number} newWork
 * @param {number} newValue
 * @param {number} newGrades
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function editRatingByStrAndData(
  classCode,
  id,
  oldRecommend,
  oldDifficulty,
  oldWork,
  oldValue,
  oldGrades,
  newRecommend,
  newDifficulty,
  newWork,
  newValue,
  newGrades,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  return await editRatingByCodeAndData(
    ClassCode.parse(classCode),
    id,
    oldRecommend,
    oldDifficulty,
    oldWork,
    oldValue,
    oldGrades,
    newRecommend,
    newDifficulty,
    newWork,
    newValue,
    newGrades,
    instructor,
    comment,
    storeErrors
  );
}

/**
 * Edits a rating
 *
 * @param {string} id
 * @param {boolean} newRecommend
 * @param {number} newDifficulty
 * @param {number} newWork
 * @param {number} newValue
 * @param {number} newGrades
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function editRatingByIdAndData(
  id,
  newRecommend,
  newDifficulty,
  newWork,
  newValue,
  newGrades,
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
          recommend: oldRecommend,
          difficulty: oldDifficulty,
          work: oldWork,
          value: oldValue,
          grades: oldGrades,
        } = ratingDoc.data();
        return await editRatingByStrAndData(
          classCode,
          id,
          oldRecommend,
          oldDifficulty,
          oldWork,
          oldValue,
          oldGrades,
          newRecommend,
          newDifficulty,
          newWork,
          newValue,
          newGrades,
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
