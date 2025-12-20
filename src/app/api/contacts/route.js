// shiprocket/app/api/contacts/route.js   ← NEW FILE
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })  // newest first
      .select("name email subject message createdAt")
      .lean();

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json(
      { error: "Failed to load contacts" },
      { status: 500 }
    );
  }
}