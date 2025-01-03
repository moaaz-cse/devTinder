const mongoose = require("mongoose"); //importing monggose

//connecting this project with cluster.
const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://moaaz:KVAGCR2009@namastenode.bo1jq.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode/devTinder"
  );
}; //mongoose.connect() will give a promise.

module.exports = { connectDB };
