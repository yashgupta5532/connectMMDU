import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "fullname is required"],
      maxLength: [40, "Name cannot exceed 40 characters"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      maxLength: [40, "username cannot exceed 40 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be greater than 8 characters"],
    },
    contactNo: {
      type: Number,
      min: [1000000000, "Contact number must have at least 10 digits"],
      max: [9999999999, "Contact number must have at most 10 digits"],
      // required:true
    },
    DOB: {
      type: Date,
      // required:true,
    },
    messages: [
      {
        // sender: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "User",
        // },
        // message: {
        //   type: String,
        // },
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    martialStatus: {
      type: String,
      // enum: ["Single", "Coupled"],
      required: true,
    },
    gender: {
      type: String,
      // enum: ["Male", "Female", "Other"],
      required: true,
    },
    avatar: {
      type: String,
    },
    interests: [{ type: String }],
    hobbies: [{ type: String }],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
      },
    ],
    department: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    yearOfStudy: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      // enum: ["user", "admin", "teacher"],
      default: "user",
    },
    status: {
      type: String,
      default: "Something status",
    },
    accountBlockedUntil: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      username: this.username,
      email: this.email,
      martialStatus: this.martialStatus,
      gender: this.gender,
      interests: this.interests,
      hobbies: this.hobbies,
      posts: this.posts,
      followers: this.followers,
      following: this.following,
      friends: this.friends,
      department: this.department,
      branch: this.branch,
      yearOfStudy: this.yearOfStudy,
      role: this.role,
      status: this.status,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
