const express = require("express");

const app = express(); //creating a new expressjs application/web-server.

//code To handle the request on the server(requestHandler function).
// app.use((req, res) => {
//   res.send("Hello from the server.");
// });

// we can set the route path also
app.use("/home", (req, res) => {
  res.send("Hello from the dashboard!");
});
app.use("/test", (req, res) => {
  res.send("Hello from the test server.");
});
app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});
// code to listen the server.
app.listen(3000, () => {
  console.log("Server is successfully on port 3000..");
}); //creating a port to listen the request.
