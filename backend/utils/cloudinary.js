import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",folder:"connectMMDU"
    });
    // console.log("response ",response)
    if (!response) {
      fs.unlinkSync(localFilePath);
      throw new ApiError(402, "Error while uploading image ");
    }
    try {
      fs.unlinkSync(localFilePath);
    } catch (error) {
      throw new ApiError(401,"Error while deleting localfle")
    }
    
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
