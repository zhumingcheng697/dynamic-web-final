const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Posts a new rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {number} enjoyment
 * @param {number} value
 * @param {number} difficulty
 * @param {number} work
 * @param {string} uid
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function postRatingByCodeAndData(
  classCode,
  enjoyment,
  value,
  difficulty,
  work,
  uid,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  if (!ClassCode.stringify(classCode)) {
    return 1;
  }

  if (
    ![1, 2, 3, 4, 5].includes(enjoyment) ||
    ![1, 2, 3, 4, 5].includes(value) ||
    ![1, 2, 3, 4, 5].includes(difficulty) ||
    ![1, 2, 3, 4, 5].includes(work) ||
    typeof uid !== "string" ||
    typeof instructor !== "string" ||
    typeof comment !== "string"
  ) {
    return 1;
  }

  const rating = {
    classCode: ClassCode.stringify(classCode),
    enjoyment,
    value,
    difficulty,
    work,
    uid,
    instructor,
    comment,
  };

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const updateInfo = {};

      updateInfo[
        `ratingSummary.enjoyment.${enjoyment}`
      ] = firebase.default.firestore.FieldValue.increment(1);

      updateInfo[
        `ratingSummary.value.${value}`
      ] = firebase.default.firestore.FieldValue.increment(1);

      updateInfo[
        `ratingSummary.difficulty.${difficulty}`
      ] = firebase.default.firestore.FieldValue.increment(1);

      updateInfo[
        `ratingSummary.work.${work}`
      ] = firebase.default.firestore.FieldValue.increment(1);

      await db
        .collection("classes")
        .doc(ClassCode.stringify(classCode))
        .update(updateInfo);

      rating["postedAt"] = firebase.default.firestore.Timestamp.fromDate(
        new Date()
      );

      await db.collection("ratings").doc().set(rating);

      return 0;
    });
  } catch (e) {
    return storeErrors ? e : 1;
  }
}

/**
 * Posts a new rating
 *
 * @param {string} classCode
 * @param {number} enjoyment
 * @param {number} value
 * @param {number} difficulty
 * @param {number} work
 * @param {string} uid
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function postRatingByStrAndData(
  classCode,
  enjoyment,
  value,
  difficulty,
  work,
  uid,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  return await postRatingByCodeAndData(
    ClassCode.parse(classCode),
    enjoyment,
    value,
    difficulty,
    work,
    uid,
    instructor,
    comment,
    storeErrors
  );
}

module.exports = { postRatingByCodeAndData, postRatingByStrAndData };
