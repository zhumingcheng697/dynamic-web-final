const express = require("express");
const router = express.Router();

const loadUser = require("../util/command/loadUser");

router.get("/", (req, res) => {
  res.send("No user id provided");
});

router.get("/:uid", (req, res) => {
  const uid = req.params.uid;

  loadUser(uid, req.query && req.query.dev === "true")
    .then((user) => {
      return res.send(user);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
