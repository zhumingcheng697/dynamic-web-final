const express = require("express");
const router = express.Router();

const { editRatingByIdAndData } = require("../util/command/editRating");

router.get("/", (req, res) => {
  res.send("No rating id provided");
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  const { enjoyment, value, difficulty, work, instructor, comment, dev } =
    req.query || {};

  editRatingByIdAndData(
    id,
    parseInt(enjoyment),
    parseInt(value),
    parseInt(difficulty),
    parseInt(work),
    instructor,
    comment,
    dev === "true"
  )
    .then((result) => {
      return res.send(typeof result === "object" ? result : `${result}`);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
