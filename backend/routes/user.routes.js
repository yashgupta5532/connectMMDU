import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  acceptRejectFriendRequest,
  blockUserAccount,
  cancelFriendRequest,
  deleteProfile,
  deleteProfileAdmin,
  followUnfollowUser,
  forgotPassword,
  getAllFriendRequestsUsers,
  getAllFriends,
  getAllOnlineUsers,
  getAllUsers,
  getMyDetails,
  getUserDetails,
  isOnline,
  loginUser,
  logoutUser,
  matchers,
  registerUser,
  resetPassword,
  searchUser,
  sendFriendRequest,
  unBlockUserAccount,
  unBlockUserAccountByAdmin,
  updateAvatar,
  updateCoverImage,
  updateOnlineStatus,
  updateProfile,
  updateRole,
} from "../controller/userController.js";
import { isAccountBlocked, isAdmin, verifyJwt } from "../middleware/auth.middleware.js";

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
router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar);
router
  .route("/coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);

router.route("/search/:keyword").get(searchUser);
router.route("/userDetails/:id").get(verifyJwt, getUserDetails);
router.route("/myDetails").get(verifyJwt, getMyDetails);

router.route("/sendFriendRequest/:id").post(verifyJwt, sendFriendRequest);
router.route("/cancelFriendRequest/:id").post(verifyJwt, cancelFriendRequest);

router
  .route("/response/friendRequest")
  .put(verifyJwt, acceptRejectFriendRequest);

router.route("/find/matchers").get(verifyJwt, matchers);
router.route("/follow-unfollow/:id").post(verifyJwt, followUnfollowUser);

router
  .route("/update/profile")
  .put(upload.single("avatar"), verifyJwt, updateProfile);
router.route("/all/friends").get(verifyJwt, getAllFriends);

router.route("/all/online/friends").get(verifyJwt, getAllOnlineUsers);

router.route("/all/friends/requests").get(verifyJwt, getAllFriendRequestsUsers);

router.route("/delete/profile").delete(deleteProfile); //user

router.route("/admin/all-users").get(verifyJwt,isAdmin,getAllUsers)

router.route("/delete/profile/admin/:id").delete(verifyJwt,isAdmin, deleteProfileAdmin); //Admin

router.route("/update/admin/role/:id").put(verifyJwt,isAdmin,updateRole)

router.route("/block/:id").put(verifyJwt, isAdmin, blockUserAccount); //Admin

router.route("/un-block/admin/:id").put(verifyJwt,isAdmin,unBlockUserAccountByAdmin)

router.route("/un-block/:id").put(unBlockUserAccount); //automatically done in 24 hours

router.route("/update/online/status").put(verifyJwt, updateOnlineStatus);
router.route("/is-online").get(verifyJwt, isOnline);

router.route("/forgot/password").post(forgotPassword);

router.route("/reset/password/:token").post(resetPassword);

export default router;
