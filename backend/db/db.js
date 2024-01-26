import mongoose from "mongoose";

export const connectDb = async (req, res) => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected to ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error while connecting to MongoDB:`, error);
  }
};
