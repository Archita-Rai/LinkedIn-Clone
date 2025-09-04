import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/post.model.js";
import ConnectionRequest from "../models/connection.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { log } from "console";

//pdf creator function
const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);
  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);
  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });
  doc.end();

  return outputPath;
};

// for signin/register
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      console.log(`${name}  ${email}  ${password}  ${username}`);
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({
      email,
    });

    if (user) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();
    console.log(newUser._id);
    const profile = new Profile({
      userId: newUser._id,
    });
    await profile.save();
    return res.json({ message: "User has been created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// for login
export const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      console.log(` ${email}  ${password}`);
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (!user)
      return res.status(404).json({ message: "you don't have account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.json({ token: token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// upload profile picture route
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  console.log(token);

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "your not found" });
    }
    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({ message: "profile picture uploaded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update user profile route
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUser } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUser;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(404).json({ message: "User already exists" });
    }

    Object.assign(user, newUser);
    await user.save();
    return res.json({ message: "User is updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyUserToken  = async (req, res) => {
  const { token, userId } = req.query;
  console.log(token,userId)

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "login again" });
    }

    if (user.token !== token) { // Compare stored token with given token
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.json({ message: "Token is valid" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

// to get user profile
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ userProfile });
  } catch {
    return res.status(500).json({ message: error.message });
  }
};

// update user-profile
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileToUpdate = await Profile.findOne({ userId: userProfile._id });

    Object.assign(profileToUpdate, newProfileData);

    await profileToUpdate.save();

    return res.json({ message: "profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get all user profile
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// dowload user resume
export const dowloadUserResume = async (req, res) => {
  const id = req.params.id;

  const userProfile = await Profile.findOne({ userId: id }).populate(
    "userId",
    "name username email  profilePicture"
  );
  let outputPath = await convertUserDataToPDF(userProfile);
  return res.json({ message: outputPath });
};

export const getUserProfileBasedOnUserName = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete work from the userProfile
export const deleteWorkEntry = async (req, res) => {
  try {
    const { token, workId } = req.body;
    const userProfile = await User.findOne({ token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    await Profile.updateOne(
      { userId: userProfile._id },
      { $pull: { pastWork: { _id: workId } } }
    );

    return res.json({ message: "Work entry deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// delete education from the userProfile
export const deleteEducationEntry = async (req, res) => {
  try {
    const { token, educationId } = req.body;
    const userProfile = await User.findOne({ token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    await Profile.updateOne(
      { userId: userProfile._id },
      { $pull: { education: { _id: educationId } } }
    );

    return res.json({ message: "Education entry deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
