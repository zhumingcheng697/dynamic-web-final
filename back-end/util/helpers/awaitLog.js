/**
 * Logs out any js objects or results of promises recursively using util.inspect
 *
 * @param {any} msg
 */
async function awaitLog(msg) {
  const util = require("util");
  console.log(util.inspect(await msg, false, null));
}

module.exports = awaitLog;
