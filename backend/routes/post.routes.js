import express from "express";
import {
  createPost,
  likeDislike,
  commentOnPost,
  updatePost,
  deletePost,
  PendingPosts,
  RejectPost,
  ApprovePost,
  DeletePostAdmin,
  getAllPosts,
  getSinglePost,
  getMyPosts,
  SearchPost,
  Admin,
  updatePostImage,
} from "../controller/postController.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/createPost").post(verifyJwt, upload.array("images", 4), createPost); 

router.route("/admin").get(verifyJwt, Admin); //Admin route
router.route("/myposts/:id").get(verifyJwt, getMyPosts);
router.route("/all-posts").get(verifyJwt, getAllPosts);
router.route("/:id").get(verifyJwt, getSinglePost);
router.route("/like-dislike/:id").post(verifyJwt, likeDislike);
router.route("/comment/:id").post(verifyJwt, commentOnPost);
router.route("/update-post/:id").put(verifyJwt, updatePost);
router.route("/update-post/image/:id").put(verifyJwt,upload.single("images"), updatePostImage);
router.route("/delete/:id").delete(verifyJwt, deletePost);
router.route("/search/:keyword").get(SearchPost);
router.route("/all/pending").get(verifyJwt, PendingPosts); //admin need to add admin middleware

router.route("/reject/:id").put(verifyJwt, RejectPost); //admin need to add admin middleware

router.route("/approve/:id").put(verifyJwt, ApprovePost); //admin need to add admin middleware

router.route("/delete-admin/:id").delete(verifyJwt, DeletePostAdmin); //admin need to add admin middleware

export default router;
