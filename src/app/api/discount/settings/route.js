// app/api/discounts/settings/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DiscountSettings from "@/models/DiscountSettings";

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
      "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
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

    let settings = await DiscountSettings.findOne({ storeId });

    if (!settings) {
      settings = await DiscountSettings.create({ storeId });
    }

    return NextResponse.json(
      { success: true, settings },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("GET discount settings error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

export async function PATCH(request) {
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

    const updates = await request.json();

    const settings = await DiscountSettings.findOneAndUpdate(
      { storeId },
      updates,
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { success: true, settings },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("PATCH discount settings error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}           