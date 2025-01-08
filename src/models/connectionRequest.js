const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//Creating a compound-index for fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //this will make connectionRequest.find({fromUserId,toUserId}) to run very fast.

// Function will be called whenever a new instance of connectionRequest is created
connectionRequestSchema.pre("save", function (next) {
  //check if fromUserId and toUserId is same.
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself.");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
