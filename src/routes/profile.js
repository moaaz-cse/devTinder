const express = require("express");
const profileRouter = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validatePasswordUpdateData,
} = require("../utils/validation");

//Making get request for profile using userAuth that has JWT wrapped inside.
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  //in this API the userAuth middle ware will run first, then in that function the next() will be called after which this callback function will execute.
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Making API to edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request.");
    }
    const loggedInUser = req.user; //userAuth has attached the user

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); //updates all the required data of the user
    await loggedInUser.save(); //this will save the data to database.

    // res.send(`${loggedInUser.firstName} your profile updated successfully`);
    //Good way to sedning the response for api call
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Making AP for forget password
profileRouter.post("/profile/password", async (req, res) => {
  try {
    const { emailId, age, newPassword } = req.body;
    const requestedUser = await User.findOne({ emailId: emailId, age: age });
    if (!requestedUser) {
      throw new Error("User does not exsits");
    }
    validatePasswordUpdateData(req);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    requestedUser.password = newPasswordHash;
    await requestedUser.save();
    res.json({
      message: "Successfully updated password.",
      data: requestedUser,
    });
  } catch (err) {
    res.status(400).json({
      message: `Update unsuccessful,  ${err.message}`,
    });
  }
});
module.exports = profileRouter;
