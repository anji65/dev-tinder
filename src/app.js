const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from the dashboard!");
});

app.use("/hello", (req, res) => {
  res.send("Hello from the hello route!");
});

app.listen(3000, () => {
  console.log("Server is successfully running on port 3000....");
});
