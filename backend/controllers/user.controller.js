import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connection.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { connect } from "http2";

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
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credential" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// upload profile picture route
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

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

// to get user profile
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilepicture"
    );

    return res.json(userProfile);
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
  const user_id = req.query.userId;
  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name username email  profilePicture"
  );
  console.log();
  let outputPath = await convertUserDataToPDF(userProfile);
  return res.json({ message: outputPath });
};

//to send connection request
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingConnection = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingConnection) {
      return res.status(404).json({ message: "Request alraedy sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.json("Request sent");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to see all my connection that I have send
export const getAllMyConnectionRequest = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json(connection);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to see all my connection request that is send by another people
export const whatAreMyConnection = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json(connection);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to accept and reject connection request
export const acceptConnetionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (action_type == "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }
    await connection.save();

    return res.json({message:"Request accepted"})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
