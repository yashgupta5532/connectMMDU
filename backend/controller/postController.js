import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  let imagesLocalPath;
  console.log('req files',req.files,Array.isArray(req.files));
  if (req.files && Array.isArray(req.files)) {
    imagesLocalPath = req.files[0].path;
  }
  console.log('file path',imagesLocalPath);

  // Validate file size
  const maxFileSize = 50 * 1024 * 1024; // 50 MB
  if (req.files[0].size > maxFileSize) {
    throw new ApiError(400, "File size exceeds the allowed limit.");
  }

  const image = await uploadOnCloudinary(imagesLocalPath);

  console.log("file path after uploading", image);

  if (!image?.url) {
    throw new ApiError(401, "Error while uploading images");
  }

  const newPost = await Post.create({
    title,
    description,
    owner: req.user._id,
    images: image?.url || "",
  });
  const createdPost = await Post.findById(newPost._id);
  if (!createdPost) {
    throw new ApiError(401, "Error while creating the post");
  }
  console.log(req.user.posts);
  req.user.posts.unshift(createdPost._id);
  await req.user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, createdPost, "Post created successfully"));
});

export const likeDislike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(401, "Post not found");
  }
  const isLiked = post.likes.includes(req.user._id);
  if (isLiked) {
    post.likes.pull(req.user._id);
  } else {
    post.likes.unshift(req.user._id);
  }
  await post.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isLiked,
        `you ${isLiked ? " Disliked " : " Liked"} the post`
      )
    );
});

export const commentOnPost = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(401, "Post not found");
  }
  let commentIndex = -1;
  post.comments.forEach((item, idx) => {
    if (item.user.toString() === req.user._id.toString()) {
      commentIndex = idx;
    }
  });
  if (commentIndex !== -1) {
    post.comments[commentIndex].comment = comment;
  } else {
    post.comments.unshift({
      user: req.user._id,
      comment,
    });
  }
  await post.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        `${
          commentIndex !== -1
            ? "comment Updated Successfully"
            : "comment added Successfully"
        }`
      )
    );
});

export const updatePost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPost) {
    throw new ApiError(401, "Erro while updating post");
  }
  // console.log(updatedPost);
  // console.log(updatedPost.owner.toString(), req.user._id.toString());

  if (updatedPost.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can update only your post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

export const updatePostImage = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const imagesLocalPath = req.file?.path;
  if (!imagesLocalPath) {
    throw new ApiError(401, "image is required");
  }
  const image = await uploadOnCloudinary(imagesLocalPath);
  if (!image.url) {
    throw new ApiError(401, "Error while uploading image");
  }
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        images: image?.url,
      },
    },
    { new: true }
  );
  return res.status(200).json(
    new ApiResponse(200,updatedPost,"Post image updated successfully")
  )
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(401, "Post not found");
  }
  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "you can delete your posts only");
  }

  const user = await User.findById(post.owner);
  console.log("user is", user);
  if (!user) {
    throw new ApiError(401, "User not found for this post");
  }
  user.posts.pull(postId);
  await user.save();
  await post.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "Approved" });
  return res.status(200).json(new ApiResponse(200, posts));
});

export const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("owner");
  if (!post) {
    throw new ApiError(401, post);
  }
  return res.status(200).json(200, post);
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const userId=req.params.id
  const user = await User.findById(userId);
  const postIds = user.posts;
  // console.log(postIds);
  const postDetails = await Promise.all(postIds.map((id) => Post.findById(id)));
  return res.status(200).json(new ApiResponse(200, postDetails));
});

export const Admin = asyncHandler(async (req, res) => {
  const posts = await Post.find({
    status: { $in: ["Pending", "Approved", "Rejected"] },
  }).populate("owner");

  const filteredPosts = posts.filter((post) => post.owner !== null);
  return res
    .status(200)
    .json(new ApiResponse(200, filteredPosts, "All Posts fetched for Admin"));
});

//admin  -->getAll Pending posts
export const PendingPosts = asyncHandler(async (req, res) => {
  // console.log('Request Parameters:', req.params);
  // console.log('Request Query:', req.query);
  const posts = await Post.find({ status: "Pending" });
  console.log(posts);

  if (posts.length === 0) {
    throw new ApiError(401, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Fetched all Pending posts"));
});

//admin  -->Reject posts
export const RejectPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        status: "Rejected",
      },
    },
    { new: true }
  );
  if (!updatedPost) {
    throw new ApiError(401, "Error while updating the status Rejected");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "post Rejected"));
});

//admin  -->Approve posts
export const ApprovePost = asyncHandler(async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { status: "Approved" },
    { new: true }
  );
  if (!updatedPost) {
    throw new ApiError(401, "Error while updating the status Approved");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post Approved successfully"));
});

//admin  -->Delete a post
export const DeletePostAdmin = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(401, "Post not found");
  }

  const user = await User.findOne({ _id: post.owner });
  if (!user) {
    throw new ApiError(401, "User not found for this post");
  }
  user.posts.pull(postId);
  await user.save();
  await post.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, "Post deleted Successfully"));
});

export const SearchPost = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const posts = await Post.find({
    $or: [
      { title: new RegExp(keyword, "i") },
      { description: new RegExp(keyword, "i") },
    ],
  });
  if (posts.length === 0) {
    throw new ApiError(401, "No posts found");
  }

  return res.status(200).json(new ApiResponse(200, posts));
});
