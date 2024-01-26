import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    // console.log("cookies ", req.cookies);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log("Token backend:", token);

    if (!token) {
      throw new ApiError(403, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decoded token is ", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role === "admin") {
    next();
  } else {
    throw new ApiError(
      403,
      `${req.user.role} is not allowed to access this resource`
    );
  }
});

export const isAccountBlocked = asyncHandler(async (req, res, next) => {
  //const userId=req.user._id; //loggedin user
  const user = req.user;
  const currentDate = new Date();
  if (user.accountBlockedUntil && user.accountBlockedUntil < currentDate) {
    return next();
  } else {
    throw new ApiError(403, "Your account is blocked");
  }
});
