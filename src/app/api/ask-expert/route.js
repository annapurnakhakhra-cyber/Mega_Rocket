import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AskExpert from "@/models/AskExpert";

/**
 * ✅ Allowed frontend URLs
 */
const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "http://10.27.4.11:3000",
  "https://annapurnakhakhra.megascale.co.in",
];

/**
 * ✅ Dynamic CORS headers
 */
const corsHeaders = (origin) => {
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    };
  }

  return {};
};

/**
 * ✅ Preflight request
 */
export async function OPTIONS(req) {
  const origin = req.headers.get("origin");

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/**
 * ✅ Handle form submission
 */
export async function POST(request) {
  try {
    await connectDB();

    const origin = request.headers.get("origin");
    const headers = corsHeaders(origin);

    const { name, email, phone, message, store } = await request.json();

    // Optional safety validation
    if (!name || !email || !message || !store) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400, headers }
      );
    }

    await AskExpert.create({
      name,
      email,
      phone,
      message,
      store,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your query has been submitted successfully.",
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Ask Expert error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit query",
      },
      { status: 500, headers: corsHeaders(request.headers.get("origin")) }
    );
  }
}
