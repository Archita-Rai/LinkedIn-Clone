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
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);
router.route("/user_update").post(updateUserProfile);
router.route("/:id/profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/:userId/resume").get(dowloadUserResume);

router.route("/profile").get(getUserProfileBasedOnUserName);

export default router;
