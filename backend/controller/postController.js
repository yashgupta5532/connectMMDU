import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "cloudinary";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  let imagesLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.images) &&
    req.files.images.length > 0
  ) {
    imagesLocalPath = req.files.images[0].path;
  }
  console.log("file path before uploading",imagesLocalPath);
  console.log("file path",req.files);

  // Validate file size
  const maxFileSize = 50 * 1024 * 1024; // 50 MB
  if (req.files.images[0].size > maxFileSize) {
    throw new ApiError(400, "File size exceeds the allowed limit.");
  }

  const image = await uploadOnCloudinary(imagesLocalPath);

  console.log("file path after uploading",image);

  if (!image?.url) {
    throw new ApiError(401, "Error while uploading images");
  }

  const newPost = await Post.create({
    title,
    description,
    images: image.url || "",
  });
  const createdPost = await Post.findById(newPost._id);
  if (!createdPost) {
    throw new ApiError(401, "Error while creating the post");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdPost, "Post created successfully"));
});

export const likeDislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post doesnot exist",
      });
    }
    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.unshift(req.user._id);
    }
    await post.save();
    res.status(200).json({
      success: true,
      message: `you ${isLiked ? " Disliked " : " Liked"} the post`,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post doesnot exist",
      });
    }
    let commentIndex = -1;
    post.comments.forEach((item, idx) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = idx;
      }
    });
    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;
    } else {
      post.comments.unshift({
        user: req.user._id,
        comment: req.body.comment,
      });
    }
    await post.save();
    res.status(200).json({
      success: true,
      message: `${
        commentIndex !== -1
          ? "comment Updated Successfully"
          : "comment added Successfully"
      }`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const updatedData = req.body;
    if (updatedData.images) {
      const myCloud = await cloudinary.v2.uploader.upload(updatedData.images, {
        folder: "avatars",
      });
      updatedData.images = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (updatedPost.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your post",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete your post only",
      });
    }

    const user = await User.findOne({ posts: postId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for this post",
      });
    }
    user.posts.pull(postId);
    await user.save();
    await post.deleteOne();
    res.status(200).json({
      success: true,
      message: "Post deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const myPosts = user.posts;
    res.status(200).json({
      success: true,
      myPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Admin = async (req, res) => {
  try {
    const posts = await Post.find({
      status: { $in: ["Pending", "Approved", "Rejected"] },
    }).populate("owner");

    const filteredPosts = posts.filter((post) => post.owner !== null);
    res.status(200).json({
      success: true,
      filteredPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin  -->getAll Pending posts
export const PendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "Pending" });
    if (!posts) {
      return res.status(404).json({
        success: false,
        message: "Posts not found",
      });
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin  -->Reject posts
export const RejectPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      status: "Rejected",
    });
    await updatedPost.save();
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Post Rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin  -->Approve posts
export const ApprovePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Post Approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin  -->Delete a post
export const DeletePostAdmin = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findOne({ posts: postId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this post",
      });
    }
    user.posts.pull(postId);
    await user.save();
    await post.deleteOne();
    res.status(200).json({
      success: true,
      message: "Post deleted Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const SearchPost = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const posts = await Post.find({
      $or: [
        { title: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
      ],
    });
    if (posts.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No posts found.",
        posts: [],
      });
    }

    res.json({
      success: true,
      message: "Posts found successfully.",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};
