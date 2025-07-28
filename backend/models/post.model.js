import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: {
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  body: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  fileType: {
    type: String,
    default: "",
  },
});

const Post = new model("Post", postSchema);
export default Post;
