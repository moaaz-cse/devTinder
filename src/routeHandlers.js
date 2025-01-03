// All below code was for lerning concepts upto lecture 18.
// const express = require("express");

// const app = express();

// // app.get("/user", (req, res) => {
// //     //Route Handlers
// //   console.log(req.accepted);
// //   res.send("Done");
// // });

// // Trying Multiple Route chaining.
// // app.get(
// //   "/user",
// //   (req, res) => {
// //     //Route Handlers
// //     console.log("Handling the Route user 1");
// //     res.send("Response from 1st handler"); //this will be responded back and code will be exited from this block.
// //     //As it is synchronous execution it will not go to the next callback function.
// //     // Also if the response in not send from the first callback user will not receive any response bcz code control will remain in this loop only.
// //   },
// //   (req, res) => {
// //     console.log("Handling the Route user 2");
// //     res.send("Response from 2nd handler");
// //   }
// // );

// // To implement multi level Route we must use next().
// app.get("/user", [
//   (req, res, next) => {
//     console.log("Handling the Route user 1");
//     // res.send("Response from 1st handler");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handling the Route user 2");
//     // res.send("Response from 2nd handler");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handling the Route user 3");
//     next();
//     // res.send("Response from 3rd handler");
//   },
//   (req, res, next) => {
//     console.log("Handling the Route user 4");
//     // res.send("Response from 4th handler");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handling the Route user 5");
//     res.send("Response from 5th handler");
//     // next();//will give error
//   },
// ]);

// app.listen(4000, () => {
//   console.log("server is successfully started on port number: 4000");
// });
