const firebaseHelper = require("../helpers/firebaseHelper");

/**
 * Loads the user with a matching uid
 *
 * @param {string} uid
 * @param {boolean} dev
 * @returns {Promise<object>}
 */
async function loadUserByUid(uid, dev = undefined) {
  if (typeof uid !== "string") {
    return {};
  }

  if (typeof dev === "undefined") {
    dev = false;
  }

  try {
    return await firebaseHelper(async (firebase) => {
      const db = firebase.default.firestore();

      const userDoc = await db.collection("users").doc(uid).get();

      if (userDoc && userDoc.exists) {
        const user = userDoc.data();

        return user;
      } else {
        return {};
      }
    });
  } catch (e) {
    return dev ? { error: e } : {};
  }
}

module.exports = loadUserByUid;
