// app/api/discounts/manual/route.js
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
      code,
      combinesWith = true,
      status = "draft",
      visibility = false,
      metadata = {},
    } = body;

    // if (!code || code.trim() === "") {
    //   return NextResponse.json(
    //     { success: false, error: "Discount code is required" },
    //     { status: 400, headers }
    //   );
    // }

    const newDiscount = await DiscountCode.create({
      storeId,
      code: code.toUpperCase().trim(),
      type: "manual",
      combinesWith,
      status,
      visibility,
      tags: ["Manual", combinesWith ? "Combine" : "Doesn't Combine"],
      metadata,
    });

    return NextResponse.json(
      { success: true, discount: newDiscount },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Create manual discount error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to create manual discount" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}