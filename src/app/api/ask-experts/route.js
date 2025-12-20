import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AskExpert from "@/models/AskExpert"; // <-- your model

export async function GET() {
  try {
    await connectDB();

    const experts = await AskExpert.find({})
      .sort({ createdAt: -1 })        // latest first
      .select("name email phone message createdAt")
      .lean();

    return NextResponse.json(experts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch expert inquiries:", error);

    return NextResponse.json(
      { error: "Failed to load expert inquiries" },
      { status: 500 }
    );
  }
}
