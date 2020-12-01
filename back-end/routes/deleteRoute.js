const express = require("express");
const router = express.Router();

const { deleteRatingById } = require("../util/command/deleteRating");

router.get("/", (req, res) => {
  res.send("No rating id provided");
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  deleteRatingById(id, req.query && req.query.storeErrors === "true")
    .then((result) => {
      return res.send(typeof result === "object" ? result : `${result}`);
    })
    .catch((e) => {
      return res.send(e);
    });
});

module.exports = router;
