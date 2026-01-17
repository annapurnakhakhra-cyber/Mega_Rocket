import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DiscountBasedShipping from "@/models/DiscountBasedShipping";

/**
 * ✅ Allowed frontend origins
 */
const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "http://10.27.4.11:3000",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000",
];

/**
 * ✅ Dynamic CORS headers (PUT FIX INCLUDED)
 */
const corsHeaders = (origin) => {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-store-id",
      "Access-Control-Allow-Credentials": "true",
    };
  }
  return {};
};

/**
 * ✅ Handle preflight requests
 */
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/**
 * ✅ GET: Fetch discount-based shipping config
 */
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

    let config = await DiscountBasedShipping.findOne({ storeId });

    if (!config) {
      config = await DiscountBasedShipping.create({
        storeId,
        enabled: false,
        rules: [],
      });
    }

    return NextResponse.json(
      { success: true, config },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("GET discount-based error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to fetch config" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/**
 * ✅ POST: Update enabled toggle OR replace all rules
 */
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

    const { enabled, rules } = await request.json();

    const config = await DiscountBasedShipping.findOneAndUpdate(
      { storeId },
      { enabled, rules },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { success: true, config },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("POST discount-based error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to save config" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/**
 * ✅ PUT: Update single discount-based rule
 */
export async function PUT(request) {
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

    const { _id, discountCode, matchType, shippingCharge } =
      await request.json();

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "_id is required for update" },
        { status: 400, headers }
      );
    }

    const config = await DiscountBasedShipping.findOne({ storeId });
    if (!config) {
      return NextResponse.json(
        { success: false, error: "Config not found" },
        { status: 404, headers }
      );
    }

    const rule = config.rules.id(_id);
    if (!rule) {
      return NextResponse.json(
        { success: false, error: "Rule not found" },
        { status: 404, headers }
      );
    }

    rule.discountCode = discountCode;
    rule.matchType = matchType;
    rule.shippingCharge = shippingCharge;

    await config.save();

    return NextResponse.json(
      { success: true, config },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("PUT discount-based error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update rule" },
      { status: 500 }
    );
  }
}
