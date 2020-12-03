const ClassCode = require("../helpers/ClassCode");
const Timestamp = require("../helpers/Timestamp");
const RatingSummary = require("../helpers/RatingSummary");
const firebaseHelper = require("../helpers/firebaseHelper");
const { getSubjectInfoByPrefix } = require("../core/subjectInfo");
const { getClassInfoByCode } = require("../core/classInfo");
const { getClassScheduleByCode } = require("../core/classSchedule");

const autoRefreshLimit = 48; // refresh at most once per 48 hours

/**
 * Loads and updates class and subject info
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function loadClassByCode(classCode, dev = undefined) {
  /**
   * Normalizes necessary classInfo values for client side
   *
   * @param {object} classInfo
   */
  function normalize(classInfo) {
    // convert Timestamp to millis
    if (classInfo && classInfo.updatedAt) {
      try {
        classInfo.updatedAt = Timestamp.toMillis(classInfo.updatedAt);
      } catch (e) {
        if (dev) {
          if (Array.isArray(classInfo.error)) {
            classInfo.error.push(e);
          } else {
            classInfo.error = [e];
          }
        }
      }
    }

    // convert db style ratingSummary to client style ratingSummary
    if (classInfo && classInfo.ratingSummary) {
      classInfo.ratingSummary = RatingSummary.summary(classInfo.ratingSummary);
    }
  }

  /**
   * Loads class info from coursicle and updates db
   *
   * @param {{schoolName: string, subjectName: string}} subjectInfo
   * @param {object} rewriteRatings
   * @param {boolean} dev
   * @returns {Promise<object>}
   */
  async function updateClassInfo(subjectInfo, rewriteRatings, dev = undefined) {
    if (typeof dev === "undefined") {
      dev = false;
    }

    try {
      const classInfo = await getClassInfoByCode(classCode);

      // check if the class info exists on coursicle
      if (classInfo && Object.keys(classInfo).length) {
        // get the class schedule if it exists on coursicle
        classInfo["schedule"] = await getClassScheduleByCode(classCode);
        classInfo["updatedAt"] = Timestamp.now();
        Object.assign(classInfo, classCode);

        if (rewriteRatings) {
          const emptyMap = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          };

          classInfo["ratingSummary"] = {
            enjoyment: Object.assign({}, emptyMap),
            value: Object.assign({}, emptyMap),
            difficulty: Object.assign({}, emptyMap),
            work: Object.assign({}, emptyMap),
          };
        }

        const classInfoToUpload = Object.assign({}, classInfo);

        // upload fetched classInfo to db
        firebaseHelper(async (firebase) => {
          const db = firebase.default.firestore();

          await db
            .collection("classes")
            .doc(ClassCode.stringify(classCode))
            .set(classInfoToUpload, { merge: true });
        });

        normalize(classInfo);

        return { classInfo, subjectInfo };
      } else {
        return {};
      }
    } catch (e) {
      return dev ? { error: e } : {};
    }
  }

  if (!classCode) {
    return {};
  }

  if (typeof dev === "undefined") {
    dev = false;
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
            updateClassInfo(subjectInfo, !!subjectInfo["ratingSummary"], dev);
          }

          normalize(classInfo);

          return { classInfo, subjectInfo };
        } else {
          return {};
        }
      });

      if (info["classInfo"]) {
        return info;
      } else {
        return await updateClassInfo(subjectInfo, true, dev);
      }
    } catch (e) {
      return dev ? { error: e } : {};
    }
  } else {
    return {};
  }
}

/**
 * Loads and updates class and subject info
 *
 * @param {string} classCode
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function loadClassByStr(classCode, dev = undefined) {
  return await loadClassByCode(ClassCode.parse(classCode, dev));
}

module.exports = { loadClassByCode, loadClassByStr };
