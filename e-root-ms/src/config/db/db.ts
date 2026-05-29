// src/config/db/db.ts
import mongoose from "mongoose";

// Use environment variable with fallback for Docker/local
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB_NAME || "orders_db";

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is missing in .env");
}

if (!DB_NAME) {
  throw new Error("MONGODB_DB_NAME is missing in .env");
}

export const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    console.log(`Database name: ${DB_NAME}`);
    
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};