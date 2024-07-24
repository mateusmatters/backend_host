import express from "express";
import * as dotenv from "dotenv";
import Users from "../mongodb/models/user.js";
import jwt from "jsonwebtoken";
import { isNull } from "util";

dotenv.config();
const router = express.Router();

//MIDDLEWARE
async function authenticateUser(req, res, next) {
  //add some code to hash password and unhash password
  const { username, hashed_password } = req.body;
  if (!username || !hashed_password) {
    return res
      .status(400)
      .json({ error: "Username and/or password not included in api request" });
  }
  const findUser = await Users.findOne({
    username: username,
    hashed_password: hashed_password,
  });
  if (findUser === null) {
    return res
      .status(400)
      .json({ error: "Username and/or password incorrect" });
  } else {
    //user and password exists in database
    req._id = findUser._id;
  }
  next();
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token has been tampered with");
    req.user = user;
    next();
  });
}

//MAIN ROUTES
//Get all users
router.route("/").get(async (req, res) => {
  try {
    const all_users = await Users.find({});
    res.status(200).json({ success: true, data: all_users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching all users information failed, please try again",
    });
  }
});

//make jwt token for login authentication
router.route("/login").post(authenticateUser, async (req, res) => {
  const username = req.body.username;
  //we do this in order to get the _id element outside of the ObjectId class and into a string
  let _id = req._id.toString();
  console.log("user credentials correct");

  const user = { _id: _id, username: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

//Create a user
router.route("/createUser").post(async (req, res) => {
  try {
    const { username, hashed_password, email } = req.body;
    const newUser = await Users.create({
      username: username,
      hashed_password: hashed_password,
      email: email,
      sex: "M",
    });
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

//Delete a user
router.route("/deleteUser").post(async (req, res) => {
  try {
    const { _id } = req.body;
    const newUser = await Users.deleteOne({ _id: _id });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

//Get individual user informaiton from token
//For any webpage, we can use a post or get request with the authenticateToken middleware
//This will allow us to create a webpage with the user information at mind
router.route("/getUser").get(authenticateToken, async (req, res) => {
  res.status(200).json({ user: req.user });
});
export default router;
