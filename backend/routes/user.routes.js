import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  acceptRejectFriendRequest,
  blockUserAccount,
  cancelFriendRequest,
  deleteProfile,
  deleteProfileAdmin,
  followUnfollowUser,
  getAllFriendRequestsUsers,
  getAllFriends,
  getAllOnlineUsers,
  getMyDetails,
  getUserDetails,
  loginUser,
  logoutUser,
  matchers,
  registerUser,
  searchUser,
  sendFriendRequest,
  unBlockUserAccount,
  updateAvatar,
  updateCoverImage,
  updateProfile,
} from "../controller/userController.js";
import { isAdmin, verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt, logoutUser);
router.route("/avatar").patch(verifyJwt,upload.single("avatar"),updateAvatar);
router.route("/coverImage").patch(verifyJwt,upload.single("coverImage"),updateCoverImage);

router.route("/search/:keyword").get(searchUser);
router.route("/userDetails/:id").get(verifyJwt,getUserDetails)
router.route("/myDetails").get(verifyJwt,getMyDetails)

router.route("/sendFriendRequest/:id").post(verifyJwt, sendFriendRequest);
router.route("/cancelFriendRequest/:id").post(verifyJwt, cancelFriendRequest);

router
  .route("/response/friendRequest")
  .put(verifyJwt, acceptRejectFriendRequest);

router.route("/find/matchers").get(verifyJwt, matchers);
router.route("/follow-unfollow/:id").post(verifyJwt,followUnfollowUser);

router.route("/update/profile").put(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateProfile
);
router.route("/all/friends").get(verifyJwt, getAllFriends);

router.route("/all/online/friends").get(verifyJwt,getAllOnlineUsers);

router.route("/all/friends/requests").get(verifyJwt, getAllFriendRequestsUsers);

router.route("/delete/profile").delete(deleteProfile); //user

router.route("/delete/profile/admin/:id").delete(isAdmin, deleteProfileAdmin); //Admin

router.route("/block/:id").put(blockUserAccount); //Admin

router.route("/un-block/:id").put(unBlockUserAccount); //automatically done in 24 hours

export default router;
