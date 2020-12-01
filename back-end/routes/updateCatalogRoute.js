const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  require("../util/command/updateSubjectCatalog");
  res.send("Updating subject catalog...");
});

module.exports = router;
