const express = require("express");
const connectDB = require("./config/database");

// require("./config/database"); //bcz of this database.js will also run when we run app.js
const app = express();
const User = require("./models/user"); //to import model we should not use {User}

// connectDB.user.createIndex({ emailId: 1 }, { unique: true });

//Adding a pre-defined middleware that convert the json object to javascript object for api calls.
app.use(express.json()); //this app.use() will ensure this middleware to work for all path/type of api calls.

//Making a POST request to save data into database/.
app.post("/signup", async (req, res) => {
  // Creating a new instance of user model with data.
  // console.log(req.body);
  const user = new User(req.body);
  try {
    //{ runValidators: true } this in user.save() will ensure emailId is of valid type.
    await user.save({ runValidators: true }); //user.save is a function that return a promise so we need to make the callback function as async.
    res.send("User Add Successfully.");
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("Duplicate email ID found!");
    } else {
      res.status(400).send("Error saving the user: " + err.message);
    }
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
    // console.log("deleting user => ", user);
    // const user = await User.findByIdAndDelete(userId); //same as above line.
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
  // const userEmailId = req.body.emailId;
  const userId = req.params.userId;
  const data = req.body;
  try {
    //Do sanitization of data.
    const ALLOWED_UPDATES = [
      "userId",
      "skills",
      "photoUrl",
      "about",
      "gender",
      "age",
    ];
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
    // console.log(updatedUser);
    if (!updatedUser) {
      res.status(404).send("User not found!");
    } else {
      res.send("User updated successfully.");
    }
  } catch (err) {
    // res.status(400).send("Something went wrong.");
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

// All below code was for lerning concepts upto lecture 18.
// const express = require("express");

// const app = express(); //creating a new expressjs application/web-server.

// //code To handle the request on the server(requestHandler function).
// // app.use((req, res) => {
// //   res.send("Hello from the server.");
// // });

// // This app.get() will only handle GET call to /user
// app.get("/user", (req, res) => {
//   // res.send("user data is fetched.");
//   console.log(req.query);//how we read query parameter.
//   res.send({ firstName: "Moaaz", lastName: "Ahmed" });
// });

// // To make POST method.
// app.post("/user", (req, res) => {
//   //Save Data to the database.
//   res.send("Data successfully saved to the database.");
// });

// // To make DELETE method.
// app.delete("/user", (req, res) => {
//   res.send("Data deleted from the database.");
// });

// // To make PATCH method.
// app.patch("/user", (req, res) => {
//   res.send("PATCH method is called to update the data.");
// });
// // we can set the route path also, This(app.use()) will match all the HTTP method API call to /test
// app.use("/test", (req, res) => {
//   res.send("Hello from the test server.");
// });

// // app.use("/home", (req, res) => {
// //   res.send("Hello from the home!");
// // });
// // app.use("/hello", (req, res) => {
// //   res.send("Hello hello hello!");
// // });
// // app.use("/", (req, res) => {
// //   res.send("Hello from the Dashboard!");
// // });

// // code to listen the server.
// app.listen(3000, () => {
//   console.log("Server is successfully on port 3000..");
// }); //creating a port to listen the request.
