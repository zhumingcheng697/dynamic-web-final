const firebaseHelper = require("../helpers/firebaseHelper");

firebaseHelper(async (firebase) => {
  const subjectCatalog = await require("../core/subjectCatalog")();
  console.log("Subject catalog loaded");

  const db = firebase.default.firestore();

  for (const schoolCode in subjectCatalog) {
    await db
      .collection("subjectCatalog")
      .doc(schoolCode)
      .set(subjectCatalog[schoolCode], { merge: true })
      .then(() => {
        console.log(`"${schoolCode}" set`);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  console.log("All set");
});
