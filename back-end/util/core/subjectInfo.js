const firebaseHelper = require("../helpers/firebaseHelper");
const parseClassPrefix = require("../helpers/ClassPrefix").parse;

/**
 * Gets the info of the subject from Albert
 *
 * @param {{subjectCode: string, schoolCode: string}} classPrefix
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function getSubjectInfoByPrefix(classPrefix, dev = undefined) {
  if (!classPrefix) {
    return {};
  }

  if (typeof dev === "undefined") {
    dev = false;
  }

  const { subjectCode, schoolCode } = classPrefix;

  if (typeof subjectCode !== "string" || typeof schoolCode !== "string") {
    return {};
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const doc = await firebase.default
        .firestore()
        .collection("subjectCatalog")
        .doc(schoolCode.toUpperCase())
        .get();

      const subjectInfo = {};

      if (doc && doc.exists) {
        const data = doc.data();

        if (data) {
          const schoolName = data["name"];
          const subjects = data["subjects"];

          if (schoolName) {
            subjectInfo["schoolName"] = schoolName;
          }

          if (subjects) {
            const subjectName = subjects[subjectCode.toUpperCase()];

            if (subjectName) {
              subjectInfo["subjectName"] = subjectName;
            }
          }
        }
      }

      return subjectInfo;
    });
  } catch (e) {
    return dev ? { error: e } : {};
  }
}

/**
 * Gets the info of the subject from Albert
 *
 * @param {str} classPrefix
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function getSubjectInfoByStr(classPrefix, dev = undefined) {
  return await getSubjectInfoByPrefix(parseClassPrefix(classPrefix), dev);
}

module.exports = { getSubjectInfoByPrefix, getSubjectInfoByStr };
