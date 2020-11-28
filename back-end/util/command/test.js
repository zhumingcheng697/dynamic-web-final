const ClassCode = require("../helpers/ClassCode");
const ClassPrefix = require("../helpers/ClassPrefix");

const subjectInfo = require("../core/subjectInfo");
const classInfo = require("../core/classInfo");
const classSchedule = require("../core/classSchedule");

(async function main() {
  const log = require("../helpers/log");

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
    log(classCode);
    log(ClassCode.normalize(classCode));
    log(ClassCode.parse(classCode));
    log(ClassPrefix.normalize(classCode));
    log(ClassPrefix.parse(classCode));
    log(await subjectInfo.getSubjectInfoByStr(classCode));
    log(await classInfo.getClassInfoByStr(classCode));
    log(await classSchedule.getClassScheduleByStr(classCode));
    log("------------");
  }

  console.log("Test done");
})();
