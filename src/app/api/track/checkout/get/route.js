import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AbandonedCheckout from "@/models/AbandonedCheckout";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const shopurl = searchParams.get("shopurl");

    if (!shopurl) {
      return NextResponse.json(
        { success: false, error: "shopurl is required" },
        { status: 400 }
      );
    }

    const data = await AbandonedCheckout.find({
      shopurl,
      status: { $ne: "completed" } // ✅ ONLY INCOMPLETE
    })
      .sort({ lastEventAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error("Get incomplete checkouts error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
