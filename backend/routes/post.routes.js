import { Router } from "express";
import {
  activeCheck,
  commentOnPost,
  createPost,
  deleteCommentsOfUser,
  deletePost,
  getAllPost,
  getCommentByPost,
  increaseLikes,
} from "../controllers/post.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPost);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentOnPost);
router.route("/get_comments").get(getCommentByPost);
router.route("/delete_comment").delete(deleteCommentsOfUser);
router.route("/increment_post_like").post(increaseLikes);

export default router;
