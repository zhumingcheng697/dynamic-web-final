/**
 * @typedef RatingSummary
 * @type {object}
 * @property {{1: number, 2: number, 3: number, 4: number, 5: number}} enjoyment
 * @property {{1: number, 2: number, 3: number, 4: number, 5: number}} value
 * @property {{1: number, 2: number, 3: number, 4: number, 5: number}} difficulty
 * @property {{1: number, 2: number, 3: number, 4: number, 5: number}} work
 */

/**
 * Calculates the average of a set of data
 *
 * @param {{1: number, 2: number, 3: number, 4: number, 5: number}} map
 * @returns {?number}
 */
function calcAvgHelper(map) {
  if (!map) {
    return null;
  }

  const { 1: ones, 2: twos, 3: threes, 4: fours, 5: fives } = map;

  if (
    typeof ones !== "number" ||
    typeof twos !== "number" ||
    typeof threes !== "number" ||
    typeof fours !== "number" ||
    typeof fives !== "number"
  ) {
    return null;
  }

  const avg =
    (ones * 1 + twos * 2 + threes * 3 + fours * 4 + fives * 5) /
    (ones + twos + threes + fours + fives);

  return isNaN(avg) ? null : avg;
}

/**
 * Calculates the average enjoyment of a class
 *
 * @param {RatingSummary} ratingSummary
 * @returns {?number}
 */
function enjoyment(ratingSummary) {
  return calcAvgHelper(ratingSummary && ratingSummary.enjoyment);
}

/**
 * Calculates the average value of a class
 *
 * @param {RatingSummary} ratingSummary
 * @returns {?number}
 */
function value(ratingSummary) {
  return calcAvgHelper(ratingSummary && ratingSummary.value);
}

/**
 * Calculates the average difficulty of a class
 *
 * @param {RatingSummary} ratingSummary
 * @returns {?number}
 */
function difficulty(ratingSummary) {
  return calcAvgHelper(ratingSummary && ratingSummary.difficulty);
}

/**
 * Calculates the average work of a class
 *
 * @param {RatingSummary} ratingSummary
 * @returns {?number}
 */
function work(ratingSummary) {
  return calcAvgHelper(ratingSummary && ratingSummary.work);
}

/**
 * Gets the rating summary of a class
 *
 * @param {RatingSummary} ratingSummary
 * @returns {{enjoyment: ?number, value: ?number, difficulty: ?number, work: ?number}}
 */
function summary(ratingSummary) {
  return {
    enjoyment: enjoyment(ratingSummary),
    value: value(ratingSummary),
    difficulty: difficulty(ratingSummary),
    work: work(ratingSummary),
  };
}

module.exports = { enjoyment, value, difficulty, work, summary };
