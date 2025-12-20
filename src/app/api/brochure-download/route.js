import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BrochureDownload from "@/models/BrochureDownload";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();
    console.log("✅ DB:", mongoose.connection.name);

    const body = await request.json();
    console.log("📦 Body:", body);

    const doc = await BrochureDownload.create(body);
    console.log("✅ Saved:", doc._id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
