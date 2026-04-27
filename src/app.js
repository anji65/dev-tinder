const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User data sent!");
});

app.post("/user/login", (req, res) => {
  res.send("User logged in successfully!");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent!");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("User deleted!");
});

app.listen(3000, () => {
  console.log("Server is successfully running on port 3000....");
});
