const puppeteer = require("puppeteer-extra");
const parseClassCode = require("../helpers/ClassCode").parse;
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const solve = require("../helpers/solve");
puppeteer.use(StealthPlugin());

/**
 * Gets the schedule of the class from coursicle
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @param {boolean} dev
 * @returns {Promise<object[]>}
 */
async function getClassScheduleByCode(classCode, dev = undefined) {
  if (!classCode) {
    return [];
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
    return [];
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
      `https://www.coursicle.com/nyu/#search=${subjectCode.toUpperCase()}${schoolCode.toUpperCase()}+${classNumber.toUpperCase()}`
    );

    await page.waitForFunction(
      () =>
        document.querySelectorAll('iframe[src*="api2/anchor"], #cardContainer')
          .length
    );

    const needSolving = await page.evaluate(() => {
      return !!document.querySelector('iframe[src*="api2/anchor"]');
    });

    if (needSolving) {
      await solve(page);
    }

    let loadFinished = false;

    while (!loadFinished) {
      try {
        await page.click(`#moreButton`);
        await page.waitForTimeout(500);
      } catch (e) {
        loadFinished = true;
        await page.waitForTimeout(1000);
      }
    }

    const classSchedule = await page.evaluate(
      (subjectCode, schoolCode, classNumber) => {
        const res = [];
        const cards = document.querySelectorAll(`div#cardContainer .card.back`);

        cards.forEach((card) => {
          const subject = card.querySelector(
            `div.courseNumberBack span.subject`
          );
          const number = card.querySelector(`div.courseNumberBack span.number`);

          if (
            subject &&
            number &&
            subject.textContent.replace(/^\s+|\s+$|\n/g, "").toUpperCase() ===
              `${subjectCode.toUpperCase()}${schoolCode.toUpperCase()}` &&
            number.textContent.replace(/^\s+|\s+$|\n/g, "").toUpperCase() ===
              classNumber.toUpperCase()
          ) {
            const section = card.querySelector(
              `div.courseNumberBack span.section`
            );

            if (section) {
              const schedule = {
                section: section.textContent.replace(/^\s+|\s+$|\n/g, ""),
              };

              const days = card.querySelector(`div.courseNameBack .days`);
              const time = card.querySelector(`div.courseNameBack .time`);
              const instructor = card.querySelector(
                `div.courseNameBack .instructor`
              );

              if (days) {
                schedule["days"] = days.textContent.replace(
                  /^\s+|\s+$|\n/g,
                  ""
                );
              }

              if (time) {
                schedule["time"] = time.textContent.replace(
                  /^\s+|\s+$|\n/g,
                  ""
                );
              }

              if (instructor) {
                schedule["instructor"] = instructor.textContent.replace(
                  /^\s+|\s+$|\n/g,
                  ""
                );
              }

              res.push(schedule);
            }
          }
        });

        return res;
      },
      subjectCode,
      schoolCode,
      classNumber
    );

    return classSchedule;
  } catch (e) {
    return dev ? [{ error: e }] : [];
  } finally {
    await browser.close();
  }
}

/**
 * Gets the schedule of the class from coursicle
 *
 * @param {string} classCode
 * @param {boolean} dev
 * @returns {Promise<object[]>}
 */
async function getClassScheduleByStr(classCode, dev = undefined) {
  return await getClassScheduleByCode(parseClassCode(classCode), dev);
}

module.exports = { getClassScheduleByCode, getClassScheduleByStr };
