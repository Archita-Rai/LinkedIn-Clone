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
  const { token, postId } = req.body;
  try {
    const user = await User.findOne({ token:token }).select("_id");

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

    await Post.deletePost({ _id: postId });
    return res.json({ message: "Post Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// user comment on the post
export const commentOnPost = async (req, res) => {
  const { token, postId, commentBody } = req.body;

  try {
    const user = await User.findOne({token:token}).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({_id:postId});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }
    const comment = new Comment({
      userId:user._id,
      postId:postId,
      body:commentBody
    })

    await comment.save();
    return res.status(200).json({message:"Comment Added"});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// get comment by post
export const getCommentByPost = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete comments
export const deleteCommentsOfUser = async (req, res) => {
  const { token, commentId } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comment = await Comment.findOne({_id:commentId});

    if(!comment){
      return res.status(404).json({message:"comment not found"});
    }

    if(comment.userId.toString() !== user._id.toString()){
      return res.status(404).json({message:"Unauthorized"});
    }

    await Comment.deleteOne({_id:commentId});
    return res.json({message:"Comment deleted"});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//increase likes
export const increaseLikes = async(req,res)=>{
  const {postId} = req.body;
  try{

    const post = await Post.findOne({_id:postId})
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }

    post.likes = post.likes+1;
    await post.save();

    return res.json({message:"Likes incremented"});

  }catch(error){
    return res.status(500).json({message:error.message});
  }
}