import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment");
}

export const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
};
