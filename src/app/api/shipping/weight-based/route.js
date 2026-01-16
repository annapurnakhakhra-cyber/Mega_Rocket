// app/api/shipping/weight-based/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WeightBasedShippingRule from "@/models/WeightBasedShippingRule";

/**
 * Allowed origins
 */
const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "https://adminrocket.megascale.co.in",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000",
];

/**
 * CORS headers
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
 * Preflight
 */
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/**
 * GET: Fetch all weight-based rules for the store
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

    const rules = await WeightBasedShippingRule.find({ storeId }).sort({
      minWeight: 1,
    });

    return NextResponse.json(
      { success: true, rules },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Weight-Based GET error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to fetch weight-based rules" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/**
 * POST: Create a new weight-based rule
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

    const body = await request.json();
    const { name, minWeight, maxWeight, price } = body;

    if (!name || minWeight === undefined || maxWeight === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, error: "name, minWeight, maxWeight, and price are required" },
        { status: 400, headers }
      );
    }

    if (minWeight < 0 || maxWeight < 0 || price < 0) {
      return NextResponse.json(
        { success: false, error: "Weights and price cannot be negative" },
        { status: 400, headers }
      );
    }

    if (minWeight >= maxWeight) {
      return NextResponse.json(
        { success: false, error: "minWeight must be less than maxWeight" },
        { status: 400, headers }
      );
    }

    const rule = await WeightBasedShippingRule.create({
      ...body,
      storeId,
    });

    return NextResponse.json(
      { success: true, message: "Weight-based rule created", rule },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Weight-Based POST error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create rule" },
      { status: 500,headers: corsHeaders(origin) }
    );
  }
}

/**
 * PUT: Update existing rule
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

    const body = await request.json();
    const { _id, ...updates } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "_id is required for update" },
        { status: 400, headers }
      );
    }

    const rule = await WeightBasedShippingRule.findOneAndUpdate(
      { _id, storeId },
      updates,
      { new: true, runValidators: true }
    );

    if (!rule) {
      return NextResponse.json(
        { success: false, error: "Rule not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { success: true, message: "Rule updated", rule },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Weight-Based PUT error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update rule" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/**
 * DELETE: Remove a rule
 */
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Rule ID is required (?id=...)" },
        { status: 400, headers }
      );
    }

    const rule = await WeightBasedShippingRule.findOneAndDelete({
      _id: id,
      storeId,
    });

    if (!rule) {
      return NextResponse.json(
        { success: false, error: "Rule not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { success: true, message: "Weight-based rule deleted" },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Weight-Based DELETE error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to delete rule" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}