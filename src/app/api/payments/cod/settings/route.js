// app/api/cod/settings/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CodSettings from "@/models/CodSettings";

/**
 * ✅ Allowed frontend origins
 */
const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "https://adminrocket,megascale.co.in",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000",
];

/**
 * ✅ Dynamic CORS headers
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
 * ✅ Handle preflight
 */
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/**
 * ✅ GET: Fetch COD + Tiered Settings
 */
export async function GET(request) {
  try {
    await connectDB();

    const origin = request.headers.get("origin");
    const headers = corsHeaders(origin);

    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required (x-store-id header)" },
        { status: 400, headers }
      );
    }

    let settings = await CodSettings.findOne({ storeId });

    // Auto-create defaults
    if (!settings) {
      settings = await CodSettings.create({
        storeId,
        codLimits: {
          lowerLimit: 0,
          upperLimit: 1500,
        },
        tiered: {
          enabled: true,
          discounts: [],
        },
      });
    }

    return NextResponse.json(
      { success: true, settings },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("COD Settings GET error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to fetch COD settings" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/**
 * ✅ POST: Update COD limits + Tiered toggle
 */
export async function POST(request) {
  try {
    await connectDB();

    const origin = request.headers.get("origin");
    const headers = corsHeaders(origin);

    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required (x-store-id header)" },
        { status: 400, headers }
      );
    }

    const { codLimits, tieredEnabled } = await request.json();

    // Validation
    if (
      codLimits &&
      (codLimits.lowerLimit === undefined ||
        codLimits.upperLimit === undefined)
    ) {
      return NextResponse.json(
        { success: false, error: "Both COD lowerLimit and upperLimit are required" },
        { status: 400, headers }
      );
    }

    const settings = await CodSettings.findOneAndUpdate(
      { storeId },
      {
        ...(codLimits && { codLimits }),
        ...(typeof tieredEnabled === "boolean" && {
          "tiered.enabled": tieredEnabled,
        }),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "COD settings updated successfully",
        settings,
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("COD Settings POST error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to update COD settings" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
