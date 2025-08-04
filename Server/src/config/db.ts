import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "MongoDB URI is required. Please provide the MONGODB_URI in the .env file"
  );
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully Connected to DB");
  } catch (error) {
    throw new Error("Error connecting to the database");
  }
};

export default connectDB;
