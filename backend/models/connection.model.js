import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionRequest = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});

const ConnectionRequest = new model("ConnectionRequest",connectionRequest);
export default ConnectionRequest
