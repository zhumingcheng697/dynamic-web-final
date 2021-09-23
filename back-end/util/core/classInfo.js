const puppeteer = require("puppeteer-extra");
const parseClassCode = require("../helpers/ClassCode").parse;
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const solve = require("../helpers/solve");
puppeteer.use(StealthPlugin());

/**
 * Gets the info of the class from coursicle
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function getClassInfoByCode(classCode, dev = undefined) {
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

  const browser = await puppeteer.launch({
    headless: !dev,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      " --disable-site-isolation-trials",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.goto(
      `https://www.coursicle.com/nyu/courses/${subjectCode.toUpperCase()}${schoolCode.toUpperCase()}/${classNumber.toUpperCase()}/`
    );

    await page.waitForFunction(
      () =>
        document.querySelectorAll(
          'iframe[src*="api2/anchor"], h1#itemViewHeader'
        ).length
    );

    const needSolving = await page.evaluate(() => {
      return !!document.querySelector('iframe[src*="api2/anchor"]');
    });

    if (needSolving) {
      await solve(page);
    }

    const classInfo = await page.evaluate(
      (subjectCode, schoolCode, classNumber) => {
        const res = {};

        const header = document.querySelector(`h1#itemViewHeader`);
        const container = document.querySelector(`div#subItemContainer`);

        if (header && header.textContent) {
          res["name"] = header.textContent
            .replace(
              `${subjectCode.toUpperCase()}${schoolCode.toUpperCase()} ${classNumber.toUpperCase()} - `,
              ""
            )
            .replace(/[:\s-]+$/g, "");
        }

        if (container) {
          for (const child of container.children) {
            const nodes = child.children;
            if (nodes.length === 2) {
              const key = nodes[0].textContent;
              const val = nodes[1].textContent;

              if (key && val) {
                res[key.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "")] =
                  val.replace(/^\s+|\s+$|\n/g, "");
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
    return dev ? { error: e } : {};
  } finally {
    await browser.close();
  }
}

/**
 * Gets the info of the class from coursicle
 *
 * @param {string} classCode
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function getClassInfoByStr(classCode, dev = undefined) {
  return await getClassInfoByCode(parseClassCode(classCode), dev);
}

module.exports = { getClassInfoByCode, getClassInfoByStr };
