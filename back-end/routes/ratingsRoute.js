const express = require("express");
const router = express.Router();

const loadRatings = require("../util/command/loadRatings");

router.get("/", (req, res) => {
  res.send("No class code or user id provided");
});

router.get("/class/:classCode", (req, res) => {
  const classCode = req.params.classCode;

  const { beforeMillis, maxAmount, storeErrors } = req.query || {};

  loadRatings
    .loadRatingsByStr(
      classCode,
      parseInt(beforeMillis),
      parseInt(maxAmount),
      undefined,
      storeErrors === "true"
    )
    .then((ratings) => {
      return res.send(ratings);
    })
    .catch((e) => {
      return res.send(e);
    });
});

router.get("/user/:uid", (req, res) => {
  const uid = req.params.uid;

  const { beforeMillis, maxAmount, storeErrors } = req.query || {};

  loadRatings
    .loadRatingsByUid(
      uid,
      parseInt(beforeMillis),
      parseInt(maxAmount),
      undefined,
      storeErrors === "true"
    )
    .then((ratings) => {
      return res.send(ratings);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
