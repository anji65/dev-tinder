const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
        expires: new Date(Date.now() + 10 * 3600000), //expires in 10 hours
      });
      res.send("Login successful!");
    } else {
      throw new Error(`Password not correct`);
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = authRouter;
