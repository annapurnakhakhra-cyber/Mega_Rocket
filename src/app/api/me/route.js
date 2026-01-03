import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// ⚠️ adjust auth logic if you use something else
export async function GET(req) {
  try {
    await connectDB();

    // Example: email coming from headers / session
    // Replace this with YOUR auth logic
    const email = req.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email }).select("shopUrl shopName");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      shopUrl: user.shopUrl,
      shopName: user.shopName,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
