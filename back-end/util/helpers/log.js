/**
 * Logs out any js objects recursively using util.inspect
 *
 * @param {any} msg
 */
function log(msg) {
  const util = require("util");
  console.log(util.inspect(msg, false, null));
}

module.exports = log;
