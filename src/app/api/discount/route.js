// app/api/discounts/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";
import DiscountSet from "@/models/DiscountSet";

const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "http://10.27.4.11:3000",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000",
];

const corsHeaders = (origin) => {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
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

export async function GET(request) {
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

    const [codes, sets] = await Promise.all([
      DiscountCode.find({ storeId }).sort({ createdAt: -1 }).lean(),
      DiscountSet.find({ storeId }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json(
      { success: true, data: { codes, sets } },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("GET discounts error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to fetch discounts" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}                 