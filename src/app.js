const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("middleware 1");
    // res.send("response 1!!");
    next();
  },
  (req, res, next) => {
    console.log("middleware 2");
    // res.send("response 2!!");
    next();
  },
  (req, res, next) => {
    console.log("middleware 3");
    res.send("response 3!!");
    // next();
  },
);

app.get("/user", (req, res) => {
  res.send({ firstName: "John", lastName: "Deo" });
});

// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.params);
//   const userId = req.params.userId;
//   const name = req.params.name;
//   const password = req.params.password;
//   res.send({ userId: userId, name: name, password: password });
// });

app.listen(3000, () => {
  console.log("Server is successfully running on port 3000....");
});
