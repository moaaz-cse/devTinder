const express = require("express");
// const User = require("../models/user");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//API to send connection request with initial validation by userAuth.
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id; //this user id is coming from userAuth
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //Allow only ignored and intrested status for sending.
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type:  " + status });
      }
      //Check user exsits or not in DB
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User does not exsits." });
      }

      // Check if there is an exsiting connectionRequest b/w the users.
      const isConnectionRequestExsits = await ConnectionRequest.findOne({
        $or: [
          {
            // checking if sender has already sent the request to receiver
            fromUserId,
            toUserId,
          },
          {
            // checking if reveiver has already sent the request to sender for ensuring both way as one connection
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (isConnectionRequestExsits) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exsits!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// API to review/responde to a request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // validate the status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed!" });
    }

    // checking that the request exsits in the database
    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not find." });
    }
    // updating the status.
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({ message: "Connection is " + status, data });
    // Moaaz->Zaki
    // loggedInUser -> toUserId
    // request Id should be valid

    try {
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);


module.exports = requestRouter;
