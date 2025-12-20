
// /lib/db.js
import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing in .env.local");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "shopify-app",
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err;
  }
}
