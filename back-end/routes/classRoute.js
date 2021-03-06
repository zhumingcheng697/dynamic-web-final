const express = require("express");
const router = express.Router();

const { loadClassByStr } = require("../util/command/loadClass");

router.get("/", (req, res) => {
  res.send("No class code provided");
});

router.get("/:classCode", (req, res) => {
  const classCode = req.params.classCode;

  loadClassByStr(classCode, req.query && req.query.dev === "true")
    .then((info) => {
      return res.send(info);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
