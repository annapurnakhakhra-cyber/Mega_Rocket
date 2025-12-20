    // app/api/test-db/route.js
import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return Response.json(
      { success: false, message: "MONGODB_URI is missing in .env" },
      { status: 500 }
    );
  }

  try {
    // Prevent multiple connections during hot reload
    if (!global._mongoClient) {
      global._mongoClient = mongoose.connect(uri);
    }

    await global._mongoClient;

    return Response.json({
      success: true,
      message: "Database connected successfully 🚀",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "DB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
