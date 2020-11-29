const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Posts a new rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} recommend
 * @param {number} difficulty
 * @param {number} work
 * @param {number} value
 * @param {number} grades
 * @param {string} uid
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function postRatingByCodeAndData(
  classCode,
  recommend,
  difficulty,
  work,
  value,
  grades,
  uid,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  if (!ClassCode.stringify(classCode)) {
    return 1;
  }

  if (
    typeof recommend !== "boolean" ||
    ![1, 2, 3, 4, 5].includes(difficulty) ||
    ![1, 2, 3, 4, 5].includes(work) ||
    ![1, 2, 3, 4, 5].includes(value) ||
    ![1, 2, 3, 4, 5].includes(grades) ||
    typeof uid !== "string" ||
    typeof instructor !== "string" ||
    typeof comment !== "string"
  ) {
    return 1;
  }

  const rating = {
    classCode: ClassCode.stringify(classCode),
    recommend,
    difficulty,
    work,
    value,
    grades,
    uid,
  };

  if (instructor) {
    rating["instructor"] = instructor;
  }

  if (comment) {
    rating["comment"] = comment;
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const updateInfo = {};
      updateInfo[
        `ratingSummary.recommend.${recommend}`
      ] = firebase.default.firestore.FieldValue.increment(1);
      updateInfo[
        `ratingSummary.difficulty.${difficulty}`
      ] = firebase.default.firestore.FieldValue.increment(1);
      updateInfo[
        `ratingSummary.work.${work}`
      ] = firebase.default.firestore.FieldValue.increment(1);
      updateInfo[
        `ratingSummary.value.${value}`
      ] = firebase.default.firestore.FieldValue.increment(1);
      updateInfo[
        `ratingSummary.grades.${grades}`
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
 * @param {boolean} recommend
 * @param {number} difficulty
 * @param {number} work
 * @param {number} value
 * @param {number} grades
 * @param {string} uid
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|Error>}
 */
async function postRatingByStrAndData(
  classCode,
  recommend,
  difficulty,
  work,
  value,
  grades,
  uid,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  return await postRatingByCodeAndData(
    ClassCode.parse(classCode),
    recommend,
    difficulty,
    work,
    value,
    grades,
    uid,
    instructor,
    comment,
    storeErrors
  );
}

module.exports = { postRatingByCodeAndData, postRatingByStrAndData };
