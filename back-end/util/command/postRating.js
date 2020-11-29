const ClassCode = require("../helpers/ClassCode");
const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Posts a new rating
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} recommend
 * @param {number} difficulty
 * @param {number} usefulness
 * @param {number} grades
 * @param {string} uid
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|object>}
 */
async function postRatingByCode(
  classCode,
  recommend,
  difficulty,
  usefulness,
  grades,
  uid,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  if (!classCode) {
    return 1;
  }

  const { subjectCode, schoolCode, classNumber } = classCode;

  if (
    typeof subjectCode !== "string" ||
    typeof schoolCode !== "string" ||
    typeof classNumber !== "string" ||
    typeof recommend !== "boolean" ||
    ![1, 2, 3, 4, 5].includes(difficulty) ||
    ![1, 2, 3, 4, 5].includes(usefulness) ||
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
    usefulness,
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
        `ratingSummary.usefulness.${usefulness}`
      ] = firebase.default.firestore.FieldValue.increment(1);
      updateInfo[
        `ratingSummary.grades.${grades}`
      ] = firebase.default.firestore.FieldValue.increment(1);

      await db
        .collection("classes")
        .doc(ClassCode.stringify(classCode))
        .update(updateInfo);

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
 * @param {number} usefulness
 * @param {number} grades
 * @param {string} uid
 * @param {string} instructor
 * @param {string} comment
 * @param {boolean} storeErrors
 * @returns {Promise<number|object>}
 */
async function postRatingByStr(
  classCode,
  recommend,
  difficulty,
  usefulness,
  grades,
  uid,
  instructor = "",
  comment = "",
  storeErrors = false
) {
  return await postRatingByCode(
    ClassCode.parse(classCode),
    recommend,
    difficulty,
    usefulness,
    grades,
    uid,
    instructor,
    comment,
    storeErrors
  );
}

module.exports = { postRatingByCode, postRatingByStr };