const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//API to send connection request with initial validation by userAuth.
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  //Sending a connection request.
  // console.log("Connection is sent by: ", user.firstName);
  res.send(user.firstName + " has sent the connection request.");
});

module.exports = requestRouter;
