const ClassCode = require("../helpers/ClassCode");
const ClassPrefix = require("../helpers/ClassPrefix");

const subjectInfo = require("../core/subjectInfo");
const classInfo = require("../core/classInfo");
const classSchedule = require("../core/classSchedule");

(async function main() {
  const log = require("../helpers/awaitLog");

  console.log("Starting test");

  for (const classCode of [
    "",
    9898,
    {},
    [],
    false,
    () => {},
    "uihr(*&&^%$uifherf",
    "iosut",
    "artshu13x",
    "cs-uy 4",
    "csuy3314",
  ]) {
    await log(classCode);
    await log(ClassCode.normalize(classCode));
    await log(ClassCode.parse(classCode));
    await log(ClassPrefix.normalize(classCode));
    await log(ClassPrefix.parse(classCode));
    await log(subjectInfo.getSubjectInfoByStr(classCode));
    await log(classInfo.getClassInfoByStr(classCode));
    await log(classSchedule.getClassScheduleByStr(classCode));
    await log("------------");
  }

  console.log("Test done");
})();
