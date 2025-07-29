import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username){
        console.log(`${name}  ${email}  ${password}  ${username}`)
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
    console.log(newUser._id)
    const profile = new Profile({
      userId: newUser._id,
    });
    await profile.save();
    return res.json({message:"User has been created"})
  } catch (error) {
    return res.status(500).json({ massage: error.massage });
  }
};

