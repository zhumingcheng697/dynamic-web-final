const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const classRoute = require("./routes/classRoute");
const ratingRoute = require("./routes/ratingRoute");
const ratingsRoute = require("./routes/ratingsRoute");
const updateCatalogRoute = require("./routes/updateCatalogRoute");

app.use("/class", classRoute);
app.use("/rating", ratingRoute);
app.use("/ratings", ratingsRoute);
app.use("/updateCatalog", updateCatalogRoute);

app.listen(port, () => {
  console.log(`Final is running at port ${port}`);
});
