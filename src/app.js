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
    res.status(500).send("Error creating user" + error.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Error fetching user" + error.message);
  }
});

// delete user by userId
app.delete("/user", async (req, res) => {
  const userId = req.body?.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user" + error.message);
  }
});

//update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body;

  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "profileUrl",
      "skills",
    ];

    const isValidUpdates = Object.keys(updateData).every((key) =>
      allowedUpdates.includes(key),
    );

    if (updateData.skills.length > 10) {
      throw new Error("Skills can't be more than 10");
    }
    if (!isValidUpdates) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    } else {
      res.send("User updated successfully");
    }
  } catch (error) {
    res.status(400).send("Error updating user" + error.message);
  }
});

// get all users from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Error fetching users" + error.message);
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
