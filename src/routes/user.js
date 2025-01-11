const express = require("express");
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstNamelastName about age gender skills photoUrl";

// Get all pending connection request of logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); //can be also written as populate("fromUserId", ["firstName","lastName","about","age","gender", "skills","photoUrl", ]);

    res.json({
      message: "Data fetched Successfully.",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).res("ERROR: " + err.message);
  }
});

// get all my connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const myConnectionList = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = myConnectionList.map((row) => row.fromUserId); //to get only user data
    res.json({ data });
  } catch (err) {
    res.status(400), send("ERROR: " + err.message);
  }
});
module.exports = userRouter;
