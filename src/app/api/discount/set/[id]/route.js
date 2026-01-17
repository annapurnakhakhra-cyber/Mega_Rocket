// app/api/discounts/set/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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
      "Access-Control-Allow-Methods": "PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-store-id",
      "Access-Control-Allow-Credentials": "true",
    };
  }
  return {};
};

// OPTIONS - CORS preflight
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

// PATCH: Update a bulk discount set
export async function PATCH(request, context) {
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

    // ✅ Get dynamic param id correctly
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Set ID is required" },
        { status: 400, headers }
      );
    }

    const updates = await request.json();

    const set = await DiscountSet.findOneAndUpdate(
      { _id: id, storeId },
      {
        ...updates,
        $set: updates.combinesWith !== undefined
          ? {
              tags: ["Manual", updates.combinesWith ? "Combine" : "Doesn't Combine"],
            }
          : {},
      },
      { new: true, runValidators: true }
    );

    if (!set) {
      return NextResponse.json(
        { success: false, error: "Discount set not found or not owned by this store" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { success: true, set },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("PATCH discount set error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to update discount set" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// DELETE: Delete a bulk discount set
export async function DELETE(request, context) {
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

    // ✅ Get dynamic param id correctly
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Set ID is required" },
        { status: 400, headers }
      );
    }

    const set = await DiscountSet.findOneAndDelete({ _id: id, storeId });

    if (!set) {
      return NextResponse.json(
        { success: false, error: "Discount set not found or not owned by this store" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { success: true, message: "Discount set deleted successfully" },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("DELETE discount set error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to delete discount set" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
    