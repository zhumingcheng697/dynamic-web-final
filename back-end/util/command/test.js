const ClassCode = require("../helpers/ClassCode");
const ClassPrefix = require("../helpers/ClassPrefix");

const subjectInfo = require("../subjectInfo");
const classInfo = require("../classInfo");
const classSchedule = require("../classSchedule");

(async function main() {
  const util = require("util");

  let log = (e) => console.log(util.inspect(e));

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
    "dm-uy 1123",
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
