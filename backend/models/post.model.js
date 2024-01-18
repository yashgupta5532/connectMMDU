import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: [40, "title cannot be greater than 40 chars"],
      required: [true, "title is required"],
    },
    description: {
      type: String,
      maxLength: [1000, "Description cannot exceed 300 characters"],
    },
    images: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);

