import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AskExpert from "@/models/AskExpert";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const corsHeaders = {
  "Access-Control-Allow-Origin": BASE_URL,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, phone, message } = await request.json();

    await AskExpert.create({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { success: true, message: "Your query has been submitted." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Ask Expert error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit query" },
      { status: 500, headers: corsHeaders }
    );
  }
}
