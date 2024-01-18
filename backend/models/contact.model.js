import mongoose from "mongoose"
import validator from "validator"

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Please Enter a valid email",
      },
    },
    address: {
      type: String,
    },
    contactNo: {
      type: Number,
      validate: {
        validator: (value) => {
          return /^\d{10}$/.test(value);
        },
        message: "Please Enter a valid Number",
      },
    },
    message: {
      type: String,
      maxLength: [1300, "message cannot exceed 1300"],
      required:true
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);

