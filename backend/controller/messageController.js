import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//create message
const sendMessage = asyncHandler(async (req, res) => {
  const senderId=req.user._id;
  const receiverId=req.params.receriverId;
  const {content}=req.body;
  if (!receiverId) throw new ApiError(401, "receiver field is required");
  if (!content) throw new ApiError(401, "message is required");

  const receiverUser = await User.findById(receiverId);
  if (!receiverUser) {
    throw new ApiError(401, "receiver not found");
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });

  await User.findByIdAndUpdate(senderId, {
    $push: { messages: message._id },
  });

  if (!message) {
    throw new ApiError(400, "Error while sending message");
  }
  return res.status(200).json(new ApiResponse(200, message, "message sent"));
});

const getMessage = asyncHandler(async (req, res) => {
  const userId=req.user._id;
  const receiverId = req.params.id;
  console.log(receiverId);
  // const { userId } = req.body;
  if (!receiverId) {
    throw new ApiError(401, "receiverId is required");
  }

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: receiverId },
      { sender: receiverId, receiver: userId },
    ],
  }).sort({ timeStamps: 1 });

  return res.status(200).json(new ApiResponse(200, messages));
});

const markAsReadMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.id;
  const message = await Message.findByIdAndUpdate(
    messageId,
    {
      read: true,
    },
    {
      new: true,
    }
  );

  if(!message){
    throw new ApiError(401,"message not found");
  }
  return res.status(200).json(
    new ApiResponse(200,message)
  )
});

export { sendMessage, getMessage ,markAsReadMessage};
