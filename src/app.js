const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //validate the data
  validateSignUpData(req);
  const { firstName, lastName, emailId, password } = req.body;
  //encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);

    if (isPasswordMatch) {
      //create JWT token
      const token = await user.getJWT();
      //add token to the cookie and send the response back to the server
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 3600000),
      });
      res.send("Login successful!");
    } else {
      throw new Error(`Password not correct`);
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Unauthorized: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const sender = req.user;
    res.send("Connection request sent successfully from " + sender.firstName);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
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
