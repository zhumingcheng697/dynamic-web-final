const puppeteer = require("puppeteer");
const parseClassCode = require("../helpers/ClassCode").parse;

/**
 * Gets the info of the class from coursicle
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} storeErrors
 * @returns {Promise<object>}
 */
async function getClassInfoByCode(classCode, storeErrors = undefined) {
  if (!classCode) {
    return {};
  }

  if (typeof storeErrors === "undefined") {
    storeErrors = false;
  }

  const { subjectCode, schoolCode, classNumber } = classCode;

  if (
    typeof subjectCode !== "string" ||
    typeof schoolCode !== "string" ||
    typeof classNumber !== "string"
  ) {
    return {};
  }

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();

    await page.goto(
      `https://www.coursicle.com/nyu/courses/${subjectCode.toUpperCase()}${schoolCode.toUpperCase()}/${classNumber}/`
    );

    const classInfo = await page.evaluate(
      (subjectCode, schoolCode, classNumber) => {
        const res = {};

        const header = document.querySelector(`h1#itemViewHeader`);
        const container = document.querySelector(`div#subItemContainer`);

        if (header && header.textContent) {
          res["name"] = header.textContent.replace(
            `${subjectCode.toUpperCase()}${schoolCode.toUpperCase()} ${classNumber} - `,
            ""
          );
        }

        if (container) {
          for (const child of container.children) {
            const nodes = child.children;
            if (nodes.length === 2) {
              const key = nodes[0].textContent;
              const val = nodes[1].textContent;

              if (key && val) {
                res[
                  key.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "")
                ] = val.replace(/^\s+|\s+$|\n/g, "");
              }
            }
          }
        }

        for (const key of [
          "Recent Professors",
          "Open Seat Checker",
          "Schedule Planner",
          "Offered",
        ]) {
          delete res[key.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "")];
        }

        return res;
      },
      subjectCode,
      schoolCode,
      classNumber
    );

    return classInfo;
  } catch (e) {
    return storeErrors ? { error: e } : {};
  } finally {
    await browser.close();
  }
}

/**
 * Gets the info of the class from coursicle
 *
 * @param {string} classCode
 * @param {boolean} storeErrors
 * @returns {Promise<object>}
 */
async function getClassInfoByStr(classCode, storeErrors = undefined) {
  return await getClassInfoByCode(parseClassCode(classCode, storeErrors));
}

module.exports = { getClassInfoByCode, getClassInfoByStr };
