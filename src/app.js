const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); //to import model we should not use {User}

//Adding a pre-defined middleware that convert the json object to javascript object for api calls.
app.use(express.json()); //this app.use() will ensure this middleware to work for all path/type of api calls.

//Routing to coorect APIs
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

//   //Making a GET API, to filter database.
// app.get("/user", async (req, res) => {
//   const usersEmail = req.body.emailId;
//   try {
//     const user = await User.findOne({ emailId: usersEmail }); //findOne will give the first matched(basically one which was saved earlier) data only, find will give all the matched data present in database.
//     // console.log(users);
//     if (!user) {
//       res.status(404).send("User not found!!");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// // Feed API - GET/feed -get all user form the database.
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// //API to delete a user.
// app.delete("/user", async (req, res) => {
//   // console.log("userId => ", req.body);
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete({ _id: userId });
//     if (user == null) {
//       res.status(404).send("User not found!");
//     } else {
//       res.status(200).send("User deleted successfully.");
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// //Patch API to update a user data.
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const data = req.body;
//   try {
//     //Doing sanitization of data.
//     const ALLOWED_UPDATES = ["skills", "photoUrl", "about", "gender", "age"];
//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed.");
//     }
//     const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     if (updatedUser.skills.length > 10) {
//       throw new Error("Choose maximum skills upto 10.");
//     }
//     if (!updatedUser) {
//       res.status(404).send("User not found!");
//     } else {
//       res.send("User updated successfully.");
//     }
//   } catch (err) {
//     res.status(400).send("UPDATE FAILED: " + err.message);
//   }
// });
