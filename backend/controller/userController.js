import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    //update refreshToken in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //doesnt modify the password again
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error while generating accessToken and refreshToken"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    martialStatus,
    gender,
    contactNo,
    DOB,
    interests,
    hobbies,
    department,
    branch,
    yearOfStudy,
  } = req.body;

  if (
    [
      fullname,
      username,
      email,
      password,
      martialStatus,
      gender,
      department,
      branch,
      yearOfStudy,
    ].some((field) => typeof field !== "string" || field.trim() === "")
  ) {
    throw new ApiError(400, "All string fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(400, "User Already Exists");
  }

  const avatarFilePath = req.files ? req.files?.avatar[0].path : null;

  let coverImageFilePath;
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverImageFilePath = req.files.coverimage[0].path;
  }

  if (!avatarFilePath) {
    throw new ApiError(400, "avatar field is required");
  }

  const avatar = await uploadOnCloudinary(avatarFilePath);
  let coverImage;
  if (coverImageFilePath) {
    coverImage = await uploadOnCloudinary(coverImageFilePath);
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: avatar.url,
    coverImage:
      coverImage?.url ||
      "https://imgs.search.brave.com/QFLg7TGQUKA9UvSvojofsO00DvMQB-zW8Obk9IX3TMs/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvaS1sb3ZlLXlv/dS1iYWNrZ3JvdW5k/LWlubGI1bWI4Zjhz/a3RmMGguanBn",
    martialStatus,
    gender,
    contactNo,
    DOB,
    interests,
    hobbies,
    department,
    branch,
    yearOfStudy,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User doesn't exist with this email");
  }

  //check password match
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(400, "Invalid Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
   
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        // { user: loggedInUser, refreshToken, accessToken },
        loggedInUser,
        "User logged In Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("userId is", userId);
  if (!userId) {
    throw new ApiError(401, "Login first");
  }
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    // secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successfully"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalFilePath = req.file.path;
  if (!avatarLocalFilePath) {
    throw new ApiError(401, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath);

  if (!avatar.url) {
    throw new ApiError(401, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImagePath = req.file.path;
  if (!coverImagePath) {
    throw new ApiError(401, "coverImage is required");
  }
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!coverImage.url) {
    throw new ApiError(401, "Error while uploading coverImage");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  );
  return res.status(200).json(new ApiResponse(200, user, "CoverImage updated"));
});

export const followUnfollowUser = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const otherUserId = req.params.id;

  const otherUser = await User.findById(otherUserId);
  if (currentUserId.equals(otherUserId)) {
    throw new ApiError(401, "You cannot follow yourself");
  }

  if (req.user.following.includes(otherUserId)) {
    await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: {
          following: otherUserId,
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      otherUserId,
      {
        $pull: {
          followers: currentUserId,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          `${req.user.fullname} started unfollowing ${otherUser.fullname}`
        )
      );
  }
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $push: {
        following: otherUserId,
      },
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    otherUserId,
    {
      $push: {
        followers: currentUserId,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        `${req.user.fullname} started following ${otherUser.fullname}`
      )
    );
});

//search user by fullname username email department branch
export const searchUser = asyncHandler(async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    const users = await User.find({
      $or: [
        { fullname: new RegExp(keyword, "i") },
        { username: new RegExp(keyword, "i") },
        { email: new RegExp(keyword, "i") },
        { department: new RegExp(keyword, "i") },
        { branch: new RegExp(keyword, "i") },
      ],
    });

    if (users) {
      return res.status(200).json(new ApiResponse(200, users));
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "Invalid UserId");
  }
  return res.status(200).json(new ApiResponse(200, user));
});

export const getMyDetails = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user));
});

//send a friend request to a user
export const sendFriendRequest = asyncHandler(async (req, res) => {
  const receipientId = req.params.id;
  const senderId = req.user._id; //authenticated user
  // console.log("logged user is", req.user);
  const user = await User.findByIdAndUpdate(receipientId, {
    $push: {
      friendRequests: { sender: senderId },
    },
  });

  await User.findByIdAndUpdate(senderId, {
    $pull: {
      friendRequests: { sender: receipientId },
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friend request send"));
});

//cancel a friend request
export const cancelFriendRequest = asyncHandler(async (req, res) => {
  const receipientId = req.params.id;
  const senderId = req.user._id; //authenticated user
  // console.log("logged user is", req.user);
  const user = await User.findByIdAndUpdate(receipientId, {
    $pull: {
      friendRequests: { sender: senderId },
    },
  });
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friend request cancelled"));
});

//now receiver will either accept or reject the friendRequest
export const acceptRejectFriendRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, friendId } = req.body;

  const user = await User.findById(userId);
  if (user.friends.includes(friendId)) {
    throw new ApiError(400, "You are already friends");
  }

  if (status === "Accepted") {
    //update in friend's database
    await User.findByIdAndUpdate(friendId, {
      $push: {
        friends: userId, //use {userId} for castError
      },
    });

    //update in yours database
    await User.findByIdAndUpdate(userId, {
      $push: {
        friends: friendId, //use {userId} for castError
      },
    });
  } else if (status === "Rejected") {
    //update the status to friendId
    await User.findByIdAndUpdate(friendId, {
      $push: {
        friendRequests: { sender: userId, status: "Rejected" },
      },
    });
  }
  await User.findByIdAndUpdate(userId, {
    $pull: {
      friendRequests: { sender: friendId },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, `FriendRequest ${status}`));
});

//get my all friends
export const getAllFriends = asyncHandler(async (req, res) => {
  try {
    const friendIds = req.user.friends;
    const allFriendsDetails = await Promise.all(
      friendIds.map((friend) => User.findById(friend))
    );

    // console.log("friendDetails", allFriendsDetails);
    return res.status(200).json(new ApiResponse(200, allFriendsDetails));
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
});

export const getAllFriendRequestsUsers = asyncHandler(async (req, res) => {
  
  const allFriends = req.user.friendRequests;
  console.log(allFriends);
  if (allFriends.length <= 0) {
    throw new ApiError(401, "No friend Requests");
  }
  return res.status(200).json(new ApiResponse(200, allFriends));
});

export const matchers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "Login first");
  }
  /*
  new RegExp(keyword,"i") --->partial matching
  new RegExp(`^{keyword}$`,"i") --->full matching starts with ^ and end with $
  */
  const users = await User.find({
    $or: [
      {
        $and: [
          { martialStatus: new RegExp(`^${user.martialStatus}$`, "i") },
          {
            gender: new RegExp(
              `^${user.gender === "Male" ? "Female" : "Male"}$`,
              "i"
            ),
          },
        ],
      },
      { department: new RegExp(`^${user.department}$`, "i") },
      { branch: new RegExp(`^${user.branch}$`, "i") },
      {
        interests: {
          $in: user.interests.map(
            (interest) => new RegExp(`^${interest}$`, "i")
          ),
        },
      },
      {
        hobbies: {
          $in: user.hobbies.map((hobby) => new RegExp(`^${hobby}$`, "i")),
        },
      },
      { friends: { $in: user.friends } },
    ],
  }).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, users));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const updatedUserInfo = req.body;
  const updatedUser = await User.findByIdAndUpdate(userId, updatedUserInfo, {
    new: true,
  });
  if (!updatedUser) {
    throw new ApiError(400, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated"));
});

//delete your own profile
export const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "login first");
  }
  await User.findByIdAndDelete(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Profile deleted successfully"));
});

//delete profile by Admin
export const deleteProfileAdmin = asyncHandler(async (req, res) => {
  const userId = req.parmas.id;
  if (!userId) {
    throw new ApiError(400, "User not found");
  }
  await User.findByIdAndDelete(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Profile deleted successfully"));
});

//Admin
export const blockUserAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const blockDurationString = process.env.BLOCK_DURATION_DAY;
  const blockDuration = parseInt(blockDurationString, 10);

  if (isNaN(blockDuration)) {
    throw new ApiError(400, "Invalid BLOCK_DURATION_DAY in .env");
  }

  const currentDate = new Date();
  const blockEndDate = new Date(currentDate.toUTCString());
  blockEndDate.setUTCDate(currentDate.getUTCDate() + blockDuration);

  user.accountBlockedUntil = blockEndDate;

  await user.save({ validateBeforeSave: false }); // validateBeforeSave --> for not modifiying password
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `Account Blocked for ${process.env.BLOCK_DURATION_DAY}`
      )
    );
});

export const unBlockUserAccount = asyncHandler(async (req, res) => {
  setInterval(async () => {
    const currentDate = new Date();
    await User.updateMany(
      { accountBlockedUntil: { $lte: currentDate } }, //filters all the blocked account
      { $unset: { accountBlockedUntil: 1 } } //update all blocked account to 1
    );
  }, 24 * 60 * 60 * 1000);
});

export const updateOnlineStatus = asyncHandler(async (req, res) => {
  const { userId, online } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "User not found ");
  }
  user.online = online;
  user.lastActivity = new Date();
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, user, `status updated to ${online}`));
});

export const isOnline = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "User not found ");
  }
  const currentTime = new Date();
  const timeDifference = currentTime - user.lastActivity;
  const maxInactiveTime = 5 * 60 * 1000; // 5 minutes
  let online;
  if (timeDifference <= maxInactiveTime) {
    online = true;
  } else {
    online = false;
  }
  return res
    .status(200)
    .json(new ApiResponse(200, `User is ${online ? "online" : "offline"}`));
});

export const getAllOnlineUsers = asyncHandler(async (req, res) => {
  const onlineUsers = await User.find({ online: true }).select(
    "-password -refreshToken"
  );
  // console.log("online suers",onlineUsers);
  if (onlineUsers.length <= 0) {
    throw new ApiError(401, "No online friends");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, onlineUsers, "Fetched all online users"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User not found"); // Added a space after "401"
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 3600000; // Token expires in 1 hour

  // Save the reset token to the user's document
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = expires;
  await user.save({ validateBeforeSave: false });

  // Send a password reset email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  console.log("heaaders ", req.headers);
  const resetLink = `${process.env.CORS_ORIGIN_URL || 'https://connectmmdu-frontend.onrender.com'}/reset/password/${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: user.email,
    subject: "CONNECT-MMDU Password Recovery",
    text: `To reset your password, click the following link: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new ApiError(401, "Error while sending mail");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "password reset mail send successfully")
      );
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const { newPassword, confirmPassword } = req.body;
  if (!token) {
    throw new ApiError(401, "Token not found in params");
  }
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(403, "Invalid resetPassword Token or has expired");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(401, "new password and confirm password doesnot match");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});
