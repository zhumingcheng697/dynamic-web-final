const express = require("express");
const router = express.Router();

const { postRatingByStrAndData } = require("../util/command/postRating");

router.get("/", (req, res) => {
  res.send("No class code provided");
});

router.get("/:classCode", (req, res) => {
  const classCode = req.params.classCode;

  const {
    enjoyment,
    value,
    difficulty,
    work,
    uid,
    instructor,
    comment,
    storeErrors,
  } = req.query || {};

  postRatingByStrAndData(
    classCode,
    parseInt(enjoyment),
    parseInt(value),
    parseInt(difficulty),
    parseInt(work),
    uid,
    instructor,
    comment,
    storeErrors === "true"
  )
    .then((result) => {
      return res.send(typeof result === "object" ? result : `${result}`);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
