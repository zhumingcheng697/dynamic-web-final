const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const classRoute = require("./routes/classRoute");
const ratingRoute = require("./routes/ratingRoute");
const ratingsRoute = require("./routes/ratingsRoute");
const updateCatalogRoute = require("./routes/updateCatalogRoute");

const postRoute = require("./routes/postRoute");
const editRoute = require("./routes/editRoute");
const deleteRoute = require("./routes/deleteRoute");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/class", classRoute);
app.use("/rating", ratingRoute);
app.use("/ratings", ratingsRoute);
app.use("/update-catalog", updateCatalogRoute);

app.use("/post", postRoute);
app.use("/edit", editRoute);
app.use("/delete", deleteRoute);

app.listen(port, () => {
  console.log(`Final back-end is running at port ${port}`);
});
