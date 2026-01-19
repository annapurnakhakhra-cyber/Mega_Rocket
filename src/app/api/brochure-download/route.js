import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BrochureDownload from "@/models/BrochureDownload";

/**
 * ✅ Allowed frontend URLs
 */
const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "http://10.27.4.11:3000",
  "https://hit-megascale.myshopify.com",
  "https://swing-9926.myshopify.com",
  "https://annapurnakhakhra.megascale.co.in",
  "https://annapurnakhakhra.storeview.in"
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
    };
  }
  return {};
};

/**
 * ✅ Preflight (CORS)
 */
export async function OPTIONS(req) {
  const origin = req.headers.get("origin");

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/**
 * ✅ POST → Save brochure download
 */
export async function POST(request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    await connectDB();

    const { name, email, phone, store } = await request.json();

    // 🔐 Validation
    if (!name || !email || !store) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400, headers }
      );
    }

    // 🔐 Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400, headers }
      );
    }

    // ✅ Save EXACTLY what exists in schema
    await BrochureDownload.create({
      name,
      email,
      phone,
      store, // ✅ this WILL save now
    });

    return NextResponse.json(
      {
        success: true,
        message: "Brochure download recorded successfully",
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("❌ Brochure download error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error while saving brochure download",
      },
      { status: 500, headers }
    );
  }
}
