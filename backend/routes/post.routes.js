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
router.route("/posts").get(getAllPost).post(upload.single("media"), createPost);

router.route("/posts/:postId").delete(deletePost);
router.route("/posts/:postId/comments").post(commentOnPost);
router.route("/posts/:postId/comments").get(getCommentByPost);
router.route("/posts/:postId/comments/:id").delete(deleteCommentsOfUser);
router.route("/posts/:postId/like").patch(increaseLikes);

export default router;
