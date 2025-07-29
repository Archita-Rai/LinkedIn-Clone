import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      console.log(`${name}  ${email}  ${password}  ${username}`);
      return res.status(400).json({ massage: "All fields are required" });
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
    return res.status(500).json({ massage: error.massage });
  }
};

export const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      console.log(` ${email}  ${password}`);
      return res.status(400).json({ massage: "All fields are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (!user)
      return res.status(404).json({ message: "you don't have account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ massage: "Invalid credential" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.json({token})
  } catch (error) {
    return res.status(500).json({ massage: error.massage });
  }
};
