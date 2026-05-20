import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "orders_db";

if (!MONGO_URI) {
  throw new Error("MONGO_DB_URI is missing in .env");
}

if (!DB_NAME) {
  throw new Error("MONGO_DB_NAME is missing in .env");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};