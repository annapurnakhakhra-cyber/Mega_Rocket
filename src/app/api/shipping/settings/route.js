// app/api/shipping/settings/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // your mongoose connection
import ShippingSettings from "@/models/ShippingSettings";

/**
 * ✅ Allowed frontend origins (same as your other routes)
 */
const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "http://10.27.4.11:3000",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000", // optional: for local development
];

/**
 * ✅ Dynamic CORS headers
 */
const corsHeaders = (origin) => {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
 * ✅ GET: Fetch shipping settings for the store
 */
export async function GET(request) {
  try {
    await connectDB();

    const origin = request.headers.get("origin");
    const headers = corsHeaders(origin);

    // Required: storeId via header
    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required (x-store-id header)" },
        { status: 400, headers }
      );
    }

    let settings = await ShippingSettings.findOne({ storeId });

    if (!settings) {
      // Auto-create default settings for new stores
      settings = await ShippingSettings.create({
        storeId,
        priceBasis: "Discounted Price", // default value
      });
    }

    return NextResponse.json(
      { success: true, settings },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Shipping Settings GET error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to fetch shipping settings" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/**
 * ✅ POST: Update price basis (Discounted Price or Original Price)
 */
export async function POST(request) {
  try {
    await connectDB();

    const origin = request.headers.get("origin");
    const headers = corsHeaders(origin);

    // Required: storeId via header
    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required (x-store-id header)" },
        { status: 400, headers }
      );
    }

    const { priceBasis } = await request.json();

    // Validation
    if (!priceBasis || !["Discounted Price", "Original Price"].includes(priceBasis)) {
      return NextResponse.json(
        { success: false, error: "Invalid priceBasis. Must be 'Discounted Price' or 'Original Price'" },
        { status: 400, headers }
      );
    }

    const settings = await ShippingSettings.findOneAndUpdate(
      { storeId },
      { priceBasis },
      { upsert: true, new: true } // creates if not exists
    );

    return NextResponse.json(
      {
        success: true,
        message: "Shipping settings updated successfully",
        settings,
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Shipping Settings POST error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to update shipping settings" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}