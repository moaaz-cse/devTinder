const express = require("express");
const connectDB = require("./config/database");
// require("./config/database"); //bcz of this database.js will also run when we run app.js
const app = express();
const User = require("./models/user"); //to import model we should not use {User}

//Making a POST request to save data into database/.
app.post("/signup", async (req, res) => {
  // Creating a new instance of user model with data.
  const user = new User({
    firstName: "Zaki",
    lastName: "Ahmed",
    emailId: "zaki123@gmail.com",
    age: 25,
    gender: "Male",
  });
  try {
    await user.save(); //user.save is a function that return a promise so we need to make the callback function as async.
    res.send("User Add Successfully.");
  } catch (err) {
    res.status(400).send("Error saving the user: ", +err.message);
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
