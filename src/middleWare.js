const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/Auth");

// Creating middleware to handle all Authorization for GET,Post...requests.

// app.use("/admin", (req, res, next) => {
//   //Checking if user is Authorized as Admin or not.
//   console.log("Doing admin authorization. ");
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized access.");
//   } else {
//     next();
//   }
// });
app.use("/admin", adminAuth);
// The above code act is a middleware to verify the admin.If verivied next will be called.

app.get("/admin/getAllData", (req, res) => {
  res.status(200).send("All data sent.");
});

app.get("/admin/deleteUser", (req, res) => {
  res.status(200).send("Deleted user data.");
});

//Below code will not call middleware, as /admin is not the route.Putting this userAuth directly here will also work the same way as like multi-route.
app.get("/user", userAuth, (req, res) => {
  console.log("Not calling middleware");
  res.send(
    "Code executed without calling middleware as in route /admin is not present."
  );
});

//Port to listen the request.
app.listen(5000, () => {
  console.log("server is successfully started on port number: 5000");
});
