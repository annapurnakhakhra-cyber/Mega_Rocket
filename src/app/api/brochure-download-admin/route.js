import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BrochureDownload from "@/models/BrochureDownload";

/**
 * 🔒 Admin GET → Fetch brochure downloads
 */
export async function GET() {
  try {
    await connectDB();

    const data = await BrochureDownload.find({})
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Admin brochure fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
