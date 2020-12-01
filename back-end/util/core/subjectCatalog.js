const puppeteer = require("puppeteer");

/**
 * Gets the subject catalog from Albert
 *
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function getSubjectCatalog(dev = undefined) {
  if (typeof dev === "undefined") {
    dev = false;
  }

  const browser = await puppeteer.launch({
    headless: !dev,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.goto(`https://sis.nyu.edu`);

    await page.waitForSelector(
      `div.centerContent > div.textBoxContainer a.buttonLink:nth-last-of-type(2)`
    );

    await page.click(
      `div.centerContent > div.textBoxContainer a.buttonLink:nth-last-of-type(2)`
    );

    await page.waitForSelector(`form#NYU_CLS_SRCH`);

    const subjectCatalog = await page.evaluate((dev) => {
      const res = {};
      const errors = [];

      const containers = document.querySelectorAll(
        `table.PSGROUPBOXWBO .PSLEVEL2SCROLLAREABODYWBO .PSGROUPBOXWBO`
      );

      containers.forEach((container) => {
        const schoolLabel = container.querySelector(`.PSGROUPBOXLABEL`);

        if (schoolLabel && schoolLabel.textContent) {
          const schoolName = schoolLabel.textContent.replace(
            /^\s+|\s+$|\n/g,
            ""
          );

          const subjects = container.querySelectorAll(
            `.PSGRIDFIRSTCOLUMN a.PSHYPERLINK`
          );

          subjects.forEach((subjectEl) => {
            const subjectText = subjectEl.textContent.replace(
              /^\s+|\s+$|\n/g,
              ""
            );

            const matches = subjectText.match(
              /^(.+) \(([a-z][a-z0-9]+?)\s*-\s*([a-z]{2}|SHU)\)$/i
            );

            if (matches && matches.length === 4) {
              const [, subjectName, subjectCode, schoolCode] = matches;

              let school = res[schoolCode.toUpperCase()];

              if (!school) {
                res[schoolCode.toUpperCase()] = {};
                school = res[schoolCode.toUpperCase()];
                school["name"] = {};
                school["subjects"] = {};
              }

              if (school["name"][schoolName]) {
                school["name"][schoolName] += 1;
              } else {
                school["name"][schoolName] = 1;
              }

              school["subjects"][subjectCode.toUpperCase()] = subjectName;
            } else {
              errors.push(subjectText);
            }
          });
        }
      });

      // Mannually adds SCA-UA
      res["UA"]["subjects"]["SCA"] = "Social and Cultural Analysis";

      // Chooses the correct schoolName with more counts
      for (const schoolCode in res) {
        const schoolNameObj = res[schoolCode]["name"];

        if (schoolNameObj) {
          res[schoolCode]["name"] = Object.keys(schoolNameObj).reduce(
            (a, b) => {
              return schoolNameObj[a] > schoolNameObj[b] ? a : b;
            }
          );
        }
      }

      // Stores errors for debugging, if necessary
      if (dev && errors.length > 0) {
        res["error"] = errors;
      }

      return res;
    }, dev);

    return subjectCatalog;
  } catch (e) {
    return dev ? { error: e } : {};
  } finally {
    await browser.close();
  }
}

module.exports = getSubjectCatalog;
