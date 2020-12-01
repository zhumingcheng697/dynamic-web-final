const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const classRoute = require("./routes/classRoute");

app.use("/class", classRoute);

app.listen(port, () => {
  console.log(`Final is running at port ${port}`);
});
