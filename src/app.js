const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// connect to the db
connectDB()
  .then(() => {
    console.log("Database connected successfully!!");
    app.listen(3000, () => {
      console.log("Server is successfully running on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Database can't be connected!!");
  });
