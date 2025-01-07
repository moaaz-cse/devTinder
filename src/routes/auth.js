const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

authRouter.use(cookieParser()); //this cookie-parser is a middleware that will convert cookie data into javascript json type.

const {
  validateLoginData,
  validateSignupData,
} = require("../utils/validation");

//Making a POST request to save data into database/.(SignUp API)
authRouter.post("/signup", async (req, res) => {
  // Creating a new instance of user model with data.
  try {
    //Valdation of data.
    validateSignupData(req);

    // Encrypting the password
    const { firstName, lastName, emailId, password, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    // console.log(req.body);
    // const user = new User(req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordHash,
    });

    //{ runValidators: true } this in user.save() will ensure emailId is of valid type. Removed as in user.js(models) have used npm validator.
    await user.save(); //user.save is a function that return a promise so we need to make the callback function as async.
    res.send("User Add Successfully.");
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("Duplicate email ID found!");
    } else {
      res.status(400).send("ERROR : " + err.message);
    }
  }
});

//Making login API
authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      // throw new Error("EmailId not present in Database.");
      throw new Error("Invalid credentials"); //Don't expose your database.
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT Token
      const token = await user.getJWT(); //offladed jwt logic to SchemaMethod in user.js file under utils.

      // Add the token to cookie and send the response back to the user.
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), //cookies will expired in 8 hours
      });
      res.send("User login successful!!");
    } else {
      // throw new Error("Password is not correct.");
      throw new Error("Invalid credentials"); //Don't expose your database.
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Making logout API
authRouter.post("/logout", async (req, res) => {
  //Basically in actual projects before logging user out we clean the databse of browser.
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful.");
});

module.exports = authRouter;
