const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); //to import model we should not use {User}
const bcrypt = require("bcrypt");
const { validateSignupData, validateLoginData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//Adding a pre-defined middleware that convert the json object to javascript object for api calls.
app.use(express.json()); //this app.use() will ensure this middleware to work for all path/type of api calls.
app.use(cookieParser()); //this cookie-parser is a middleware that will convert cookie data into javascript json type.

//Making a POST request to save data into database/.(SignUp API)
app.post("/signup", async (req, res) => {
  // Creating a new instance of user model with data.
  try {
    //Valdation of data.
    validateSignupData(req);

    // Encrypting the password
    const { firstName, lastName, emailId, password, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

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
app.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      // throw new Error("EmailId not present in Database.");
      throw new Error("Invalid credentials"); //Don't expose your database.
    }
    const isPasswordValid = await bcrypt.compare(password, user.password); //bcrypt.compare(userenteredPassword, HashPasswordInDatabase)

    if (isPasswordValid) {
      // Create a JWT Token
      const token = jwt.sign({ _id: user._id }, "DEV@TINDER0212");

      // Add the token to cookie and send the response back to the user.
      res.cookie("token", token);
      res.send("User login successful!!");
    } else {
      // throw new Error("Password is not correct.");
      throw new Error("Invalid credentials"); //Don't expose your database.
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Making get request for profile using JWT wrapped inside cookie.
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies; //req.cookies will give back all the cookies.

    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token.");
    }
    //Validate my token.
    const decodedMessage = await jwt.verify(token, "DEV@TINDER0212"); // It return promise, this decodedMessage will contain {_id:354354sdas64,iat:534354} "iat" is something created by jwt.
    const { _id } = decodedMessage;

    //getting the user with the help of decoded id.
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exists.");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Making a GET API, to filter database.
app.get("/user", async (req, res) => {
  const usersEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: usersEmail }); //findOne will give the first matched(basically one which was saved earlier) data only, find will give all the matched data present in database.
    // console.log(users);
    if (!user) {
      res.status(404).send("User not found!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Feed API - GET/feed -get all user form the database.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//API to delete a user.
app.delete("/user", async (req, res) => {
  // console.log("userId => ", req.body);
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (user == null) {
      res.status(404).send("User not found!");
    } else {
      res.status(200).send("User deleted successfully.");
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Patch API to update a user data.
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    //Doing sanitization of data.
    const ALLOWED_UPDATES = ["skills", "photoUrl", "about", "gender", "age"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (updatedUser.skills.length > 10) {
      throw new Error("Choose maximum skills upto 10.");
    }
    if (!updatedUser) {
      res.status(404).send("User not found!");
    } else {
      res.send("User updated successfully.");
    }
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established");
    app.listen(7777, () => {
      console.log("Server is successfully on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
