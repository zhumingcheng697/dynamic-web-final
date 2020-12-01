const express = require("express");
const router = express.Router();

const loadRating = require("../util/command/loadRating");

router.get("/", (req, res) => {
  res.send("No rating id provided");
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  loadRating(id, undefined, req.query.storeErrors === "true")
    .then((rating) => {
      return res.send(rating);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
