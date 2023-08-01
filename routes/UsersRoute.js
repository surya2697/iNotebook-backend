require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const fetchUser = require("../middleware/fetchUser");
const users = Router();

users.get("/", (req, res) => {
  res.send("This is a Users route");
});

users.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ msg: "User already exits" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user = new UserModel({ username, email, password: hashPassword });
      await user.save();
      let token = jwt.sign(
        { id: user.id, username, email },
        process.env.secret_key
      );
      res.send({ msg: "User registered successfully", token: token });
      //console.log("User registered successfully")
    }
  } catch (error) {
    res.send(error.message);
  }
});

users.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const verify = await bcrypt.compare(password, user.password);
      if (verify) {
        const details = {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        };
        const token = jwt.sign(details, process.env.secret_key);
        res.send({ msg: "Logged in sucessfully", token: token });
      } else {
        res.send({ msg: "Wrong Credentails", error: error.message });
      }
    } else {
      res.send({ msg: "Wrong Credentails", error: error.message });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

users.post("/getuser", fetchUser, async (req, res) => {
  
  try {
    const userId=req.user.id
    if (userId) {
      const user = await UserModel.findById(userId).select("-password");
      res.send(user);
    } else {
      res.send({ msg: "Cannot find user" });
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = users;
