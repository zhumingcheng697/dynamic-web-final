/**
 * Parses class prefix (eg. DM-UY, csuy, EXPOS UA, MCCUE, etc.) into sections
 *
 * @param {string} classPrefix
 * @returns {?{subjectCode: string, schoolCode: string}}
 */
function parse(classPrefix) {
  if (typeof classPrefix !== "string") {
    return null;
  }

  const matches = classPrefix.match(
    /^([a-z][a-z0-9]+?)(?:-|\s)*([a-z]{2}|SHU)(?:(?:-|\s)*(?:[0-9]+[0-9x]*))?$/i
  );

  if (matches && matches.length === 3) {
    return {
      subjectCode: matches[1].toUpperCase(),
      schoolCode: matches[2].toUpperCase(),
    };
  }

  return null;
}

/**
 * Stringifies class prefix from sections
 *
 * @param {{subjectCode: string, schoolCode: string}} classPrefix
 * @returns {string}
 */
function stringify(classPrefix) {
  if (!classPrefix) {
    return "";
  }

  const { subjectCode, schoolCode } = classPrefix;

  if (typeof subjectCode !== "string" || typeof schoolCode !== "string") {
    return "";
  }

  return `${subjectCode.toUpperCase()}-${schoolCode.toUpperCase()}`;
}

/**
 * Normalizes class prefix (eg. DM-UY)
 *
 * @param {string} classPrefix
 * @returns {string}
 */
function normalize(classPrefix) {
  return stringify(parse(classPrefix));
}

module.exports = { parse, stringify, normalize };
