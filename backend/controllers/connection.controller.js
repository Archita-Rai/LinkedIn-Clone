import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

import ConnectionRequest from "../models/connection.model.js";

//to send connection request
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token: token });
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
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to see all my connection request that is send by another people
export const whatAreMyConnection = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");


    return res.json(connections);



  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to accept and reject connection request
export const acceptConnectionRequest = async (req, res) => {
  const { token, action_type } = req.body;

  const { connectionId } = req.params;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: connectionId });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (action_type == "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }
    await connection.save();

    return res.json({ message: "Request accepted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
