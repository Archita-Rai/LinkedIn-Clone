import { Router } from "express";
import {
  getAllUserProfile,
  getUserAndProfile,
  login,
  register,
  dowloadUserResume,
  updateProfileData,
  updateUserProfile,
  uploadProfilePicture,
  getUserProfileBasedOnUserName,
  deleteWorkEntry,
  deleteEducationEntry,
} from "../controllers/user.controller.js";
import multer from "multer";

const router = Router({ mergeParams: true });

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

router.route("/").get(getAllUserProfile);
router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/:id/profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);
router.route("/:id").put(updateUserProfile);
router.route("/:id/profile").get(getUserAndProfile);
router.route("/profiles/:profileId").put(updateProfileData);
router.route("/:id/resume").get(dowloadUserResume);

router.route("/profile").get(getUserProfileBasedOnUserName);
router.route("/profiles/work").delete(deleteWorkEntry);
router.route("/profiles/education").delete(deleteEducationEntry)

export default router;
