const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  // Read the token and validate
  // find the corresponding user
  // error handling.
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid.");
    }
    const decodedObj = await jwt.verify(token, "DEV@TINDER0212");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.user = user; //as we have already find the user, here by req.user=user we are attaching this found user to req.This will ensure the next function will get user.
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
