
import { NextResponse } from "next/server";
import connectToDB  from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { adminName, email, shopName, shopUrl, accessToken } = body;

    // Validate required fields
    if (!adminName || !email || !shopName || !shopUrl || !accessToken) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      adminName,
      email,
      shopName,
      shopUrl,
      accessToken,
    });

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );

  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
