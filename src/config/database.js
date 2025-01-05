const mongoose = require("mongoose"); //importing monggose

//connecting this project with cluster.
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://moaaz:KVAGCR2009@namastenode.bo1jq.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamasteNode"
  );
}; //mongoose.connect() will give a promise.

module.exports = connectDB;
