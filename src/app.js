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

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// get all users from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
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
