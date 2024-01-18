import { Contact } from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, address, contactNo, message } = req.body;

  if (contactNo.length !== 10) {
    throw new ApiError(401, "Please enter a valid 10 digit phone no.");
  }
  if (message.trim() === "") {
    throw new ApiError(401, "Please write some message");
  }
  const contact = await Contact.create({
    name,
    email,
    address,
    contactNo,
    message,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Contact form submitted successully"));
});

//Admin
export const getAllContact = asyncHandler(async (req, res) => {
  const allContact = await Contact.find();
  if (!allContact) {
    throw new ApiError(401, "No contacts found");
  }
  return res.status(200).json(new ApiResponse(200, allContact));
});
