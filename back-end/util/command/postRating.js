const ClassCode = require("../helpers/ClassCode");
const Timestamp = require("../helpers/Timestamp");
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
 * @param {boolean} dev
 * @returns {Promise<number|string|Error>}
 */
async function postRatingByCodeAndData(
  classCode,
  enjoyment,
  value,
  difficulty,
  work,
  uid,
  instructor,
  comment = undefined,
  dev = undefined
) {
  if (!ClassCode.stringify(classCode)) {
    return 1;
  }

  if (typeof comment === "undefined") {
    comment = "";
  }

  if (typeof dev === "undefined") {
    dev = false;
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
    postedAt: Timestamp.now(),
  };

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const updateInfo = {};
      const incrementBy1 = firebase.default.firestore.FieldValue.increment(1);
      updateInfo[`ratingSummary.enjoyment.${enjoyment}`] = incrementBy1;
      updateInfo[`ratingSummary.value.${value}`] = incrementBy1;
      updateInfo[`ratingSummary.difficulty.${difficulty}`] = incrementBy1;
      updateInfo[`ratingSummary.work.${work}`] = incrementBy1;

      await db
        .collection("classes")
        .doc(ClassCode.stringify(classCode))
        .update(updateInfo);

      const ref = db.collection("ratings").doc();

      await ref.set(rating);

      return ref.id;
    });
  } catch (e) {
    return dev ? e : 1;
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
 * @param {boolean} dev
 * @returns {Promise<number|string|Error>}
 */
async function postRatingByStrAndData(
  classCode,
  enjoyment,
  value,
  difficulty,
  work,
  uid,
  instructor,
  comment = undefined,
  dev = undefined
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
    dev
  );
}

module.exports = { postRatingByCodeAndData, postRatingByStrAndData };
