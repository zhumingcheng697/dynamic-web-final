const ClassCode = require("./util/helpers/ClassCode");
const firebaseHelper = require("./util/helpers/firebaseHelper");
const { getSubjectInfoByPrefix } = require("./util/core/subjectInfo");

const autoRefreshLimit = 1; // refresh at most once per hour

/**
 * Loads and updates class and subject info
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} storeErrors
 * @returns {Promise<object>}
 */
async function loadClassByCode(classCode, storeErrors = false) {
  /**
   * Loads class info from coursicle and updates db
   *
   * @param {{schoolName: string, subjectName: string}} subjectInfo
   * @param {boolean} storeErrors
   * @returns {Promise<object>}
   */
  async function updateClassInfo(subjectInfo, storeErrors = false) {
    try {
      const { getClassInfoByCode } = require("./util/core/classInfo");
      const classInfo = await getClassInfoByCode(classCode);

      // check if the class info exists on coursicle
      if (classInfo && Object.keys(classInfo).length) {
        const { getClassScheduleByCode } = require("./util/core/classSchedule");

        // get the class schedule if it exists on coursicle
        classInfo["schedule"] = await getClassScheduleByCode(classCode);
        Object.assign(classInfo, classCode);

        // upload fetched classInfo to db
        firebaseHelper(async (firebase) => {
          const db = firebase.default.firestore();

          classInfo[
            "updatedAt"
          ] = firebase.default.firestore.Timestamp.fromDate(new Date());

          await db
            .collection("classes")
            .doc(ClassCode.stringify(classCode))
            .set(classInfo, { merge: true });
        });

        return { classInfo, subjectInfo };
      } else {
        return {};
      }
    } catch (e) {
      return storeErrors ? { error: e } : {};
    }
  }

  if (!classCode) {
    return {};
  }

  const { subjectCode, schoolCode, classNumber } = classCode;

  if (
    typeof subjectCode !== "string" ||
    typeof schoolCode !== "string" ||
    typeof classNumber !== "string"
  ) {
    return {};
  }

  // check if the subject code in valid by getting subjectInfo from db
  const subjectInfo = await getSubjectInfoByPrefix({ subjectCode, schoolCode });

  if (subjectInfo && Object.keys(subjectInfo).length) {
    try {
      const info = await firebaseHelper(async (firebase) => {
        const db = firebase.default.firestore();

        const classInfoDoc = await db
          .collection("classes")
          .doc(ClassCode.stringify(classCode))
          .get();

        // check if the class exists in db
        if (classInfoDoc && classInfoDoc.exists) {
          const classInfo = classInfoDoc.data();

          // check if the info is from more than 1 hour ago
          if (
            classInfo &&
            new Date() - classInfo["updatedAt"].toDate() >
              autoRefreshLimit * 60 * 60 * 1000
          ) {
            updateClassInfo(subjectInfo, storeErrors);
          }

          return { classInfo, subjectInfo };
        } else {
          return {};
        }
      });

      if (info["classInfo"]) {
        return info;
      } else {
        return await updateClassInfo(subjectInfo, storeErrors);
      }
    } catch (e) {
      return storeErrors ? { error: e } : {};
    }
  } else {
    return {};
  }
}

/**
 * Loads and updates class and subject info
 *
 * @param {string} classCode
 * @param {boolean} storeErrors
 * @returns {Promise<object>}
 */
async function loadClassByStr(classCode, storeErrors = false) {
  return await loadClassByCode(parseClassCode(classCode, storeErrors));
}

module.exports = { loadClassByCode, loadClassByStr };
