import mongoose from "mongoose";
const { Schema, model } = mongoose;

const educationSchema = new Schema({
  school: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
});

const workSchema = new Schema({
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: String,
    default: "",
  },
});

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bio: {
    type: String,
    default: "",
  },
  currentPost: {
    type: String,
    default: "",
  },
  pastWork: {
    type: [workSchema],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
});

const Profile = new model("Profile",profileSchema);
export default Profile
