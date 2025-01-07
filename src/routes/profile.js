const express = require("express");
const User = require("../models/user");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//Making get request for profile using userAuth that has JWT wrapped inside.
profileRouter.get("/profile", userAuth, async (req, res) => {
  //in this API the userAuth middle ware will run first, then in that function the next() will be called after which this callback function will execute.
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;
