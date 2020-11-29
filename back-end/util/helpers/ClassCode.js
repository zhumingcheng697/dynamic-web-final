/**
 * Parses class code (eg. DM-UY 3193, csuy1134, EXPOS UA-1, MCCUE 1, etc.) into sections
 *
 * @param {string} classCode
 * @returns {?{subjectCode: string, schoolCode: string, classNumber: string}}
 */
function parse(classCode) {
  if (typeof classCode !== "string") {
    return null;
  }

  const matches = classCode.match(
    /^([a-z][a-z0-9]+?)(?:-|\s)*([a-z]{2}|SHU)(?:-|\s)*([0-9]+[0-9x]*)$/i
  );

  if (matches && matches.length === 4) {
    return {
      subjectCode: matches[1].toUpperCase(),
      schoolCode: matches[2].toUpperCase(),
      classNumber: matches[3],
    };
  }

  return null;
}

/**
 * Stringifies class code from sections
 *
 * @param {{subjectCode: string, schoolCode: string, classNumber: string}} classCode
 * @returns {string}
 */
function stringify(classCode) {
  if (!classCode) {
    return "";
  }

  const { subjectCode, schoolCode, classNumber } = classCode;

  if (
    typeof subjectCode !== "string" ||
    typeof schoolCode !== "string" ||
    typeof classNumber !== "string"
  ) {
    return "";
  }

  return `${subjectCode.toUpperCase()}-${schoolCode.toUpperCase()} ${classNumber}`;
}

/**
 * Normalizes class code (eg. DM-UY 3193)
 *
 * @param {string} classCode
 * @returns {string}
 */
function normalize(classCode) {
  return stringify(parse(classCode));
}

module.exports = { parse, stringify, normalize };
