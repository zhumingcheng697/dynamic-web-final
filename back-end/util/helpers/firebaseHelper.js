const firebase = require("firebase");
require("dotenv").config({
  path: require("path").join(__dirname, "./../../.env"),
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "dynamic-web-final-mz.firebaseapp.com",
  databaseURL: "https://dynamic-web-final-mz.firebaseio.com",
  projectId: "dynamic-web-final-mz",
  storageBucket: "dynamic-web-final-mz.appspot.com",
  messagingSenderId: "96292467053",
  appId: "1:96292467053:web:46d9d62a79f7fd96b76a64",
};

async function login(debug = false) {
  return firebase.default
    .auth()
    .signInWithEmailAndPassword(
      process.env.FIREBASE_EMAIL,
      process.env.FIREBASE_PASSWORD
    )
    .then(() => {
      if (debug) {
        console.log("Logged in");
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

async function logout(debug = false) {
  return firebase.default
    .auth()
    .signOut()
    .then(() => {
      if (debug) {
        console.log("Logged out");
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

/**
 * @callback firebaseHelperCallback
 * @param {globalThis.firebase} firebase
 */

/**
 *
 * @param {firebaseHelperCallback} callback
 * @param {boolean} debug
 */
async function main(callback, debug = false) {
  try {
    firebase.default.initializeApp(firebaseConfig);
    await login(debug);

    if (debug) {
      console.log("Started running callback");
    }

    await callback(firebase);

    if (debug) {
      console.log("Finished running callback");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await logout(debug);
  }
}

module.exports = main;
