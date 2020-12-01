const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const classRoute = require("./routes/classRoute");
const ratingRoute = require("./routes/ratingRoute");
const ratingsRoute = require("./routes/ratingsRoute");

app.use("/class", classRoute);
app.use("/rating", ratingRoute);
app.use("/ratings", ratingsRoute);

app.listen(port, () => {
  console.log(`Final is running at port ${port}`);
});
