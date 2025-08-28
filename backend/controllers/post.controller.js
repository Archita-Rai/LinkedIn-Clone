import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";
import Profile from "../models/profile.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    return res.json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// to see all the post
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Delete post
export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unautorized" });
    }

    await Post.deleteOne({ _id: postId });
    return res.json({ message: "Post Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// user comment on the post
export const commentOnPost = async (req, res) => {
  const { token, commentBody } = req.body;
  const { postId } = req.params;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentCount: 1 } },
      { new: true }
    );
    const comment = new Comment({
      userId: user._id,
      postId: postId,
      body: commentBody.trim(),
    });

    await comment.save();
    return res.status(200).json({ message: "Comment Added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get comment by post
export const getCommentByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ postId: postId }).populate(
      "userId",
      "name username profilePicture"
    );

    return res.json(comments.reverse());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete comments
export const deleteCommentsOfUser = async (req, res) => {
  const { token } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comment = await Comment.findOne({ _id: id });

    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(4043).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndUpdate(
      comment.postId,
      { $inc: { commentCount: -1 } },
      { new: true }
    );

    await Comment.findByIdAndDelete(id);

    return res.json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//increase likes
export const increaseLikes = async (req, res) => {
  const { postId } = req.params;
  const { token } = req.body;
  console.log(token);
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userIndex = post.likedBy.findIndex(
      (id) => id.toString() === user._id.toString()
    );

    if (userIndex === -1) {
      // user hasn't liked yet → like it
      post.likedBy.push(user._id);
      post.likes += 1;
    } else {
      // user already liked → unlike it
      post.likedBy.splice(userIndex, 1);
      post.likes -= 1;
    }

    // post.likes = post.likes + 1;
    await post.save();

    // return res.json({ message: "Likes incremented" });

    return res.status(200).json({
      likes: post.likes,
      likedByUser: userIndex === -1 ? true : false,
    });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
