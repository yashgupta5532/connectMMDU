import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
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

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    martialStatus,
    gender,
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

  const avatarFilePath = req.files ? req.files.avatar[0].path : null;

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
    coverImage: coverImage?.url || "",
    martialStatus,
    gender,
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

const loginUser = asyncHandler(async (req, res) => {
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
  // console.log("accessToken",accessToken,"refreshToken",refreshToken)

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // sameSite: "None",
    secure: false, // if https then make it true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
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

//search user by fullname username email department branch
const searchUser = asyncHandler(async (req, res, next) => {
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

//send a friend request to a user
const sendFriendRequest = asyncHandler(async (req, res) => {
  const receipientId = req.params.id;
  const senderId = req.user._id; //authenticated user
  console.log("logged user is", req.user);
  const user = await User.findByIdAndUpdate(receipientId, {
    $push: {
      friendRequests: { sender: senderId },
    },
  });
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friend request send"));
});

//now receiver will either accept or reject the friendRequest
const acceptRejectFriendRequest = asyncHandler(async (req, res) => {
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
const getAllFriends = asyncHandler(async (req, res) => {
  const friends = req.user.friends;
  if (friends.length <= 0) {
    throw new ApiError(401, "No friends");
  }
  return res.status(200).json(new ApiResponse(200, friends));
});

const matchers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // console.log("user is", user);
  // console.log("req user is", req.user);
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
  });

  return res.status(200).json(new ApiResponse(200, users));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const updatedUserInfo = req.body;
  // console.log("updatedinfo",updatedUserInfo)
  if (updatedUserInfo.avatar) {
    const avatarLocalFilePath = req.files ? req.files.avatar[0].path : null;
    console.log("avatar url", avatarLocalFilePath);
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    console.log("avatar ", avatar);
    updatedUserInfo.avatar = avatar.url;
  }

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
const deleteProfile = asyncHandler(async (req, res) => {
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
const deleteProfileAdmin = asyncHandler(async (req, res) => {
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
const blockUserAccount = asyncHandler(async (req, res) => {
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

const unBlockUserAccount = asyncHandler(async (req, res) => {
  setInterval(async () => {
    const currentDate = new Date();
    await User.updateMany(
      { accountBlockedUntil: { $lte: currentDate } }, //filters all the blocked account
      { $unset: { accountBlockedUntil: 1 } } //update all blocked account to 1
    );
  }, 24 * 60 * 60 * 1000);
});

export {
  registerUser,
  loginUser,
  logoutUser,
  searchUser,
  sendFriendRequest,
  acceptRejectFriendRequest,
  matchers,
  updateProfile,
  deleteProfile,
  deleteProfileAdmin,
  blockUserAccount,
  unBlockUserAccount,
  getAllFriends,
};
