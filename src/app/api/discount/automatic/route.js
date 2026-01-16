// app/api/discounts/automatic/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";

const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "https://adminrocket.megascale.co.in",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000",
];

const corsHeaders = (origin) => {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-store-id",
      "Access-Control-Allow-Credentials": "true",
    };
  }
  return {};
};

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

export async function POST(request) {
  try {
    await connectDB();

    const origin = request.headers.get("origin");
    const headers = corsHeaders(origin);

    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required" },
        { status: 400, headers }
      );
    }

    const body = await request.json();
    const {
      title, // internal name for automatic
      combinesWith = true,
      status = "active",
      visibility = false,
      metadata = {},
    } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Title is required for automatic discount" },
        { status: 400, headers }
      );
    }

    const newDiscount = await DiscountCode.create({
      storeId,
      code: title.trim(), // used as internal identifier
      type: "automatic",
      combinesWith,
      status,
      visibility,
      tags: ["Automatic", combinesWith ? "Combine" : "Doesn't Combine"],
      metadata,
    });

    return NextResponse.json(
      { success: true, discount: newDiscount },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Create automatic discount error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to create automatic discount" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}