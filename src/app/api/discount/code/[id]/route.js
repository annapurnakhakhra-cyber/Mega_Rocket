// app/api/discounts/code/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DiscountCode from "@/models/DiscountCode";

const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "https://adminrocket.megascale.co.in",
  "https://annapurnakhakhra.megascale.co.in",
  "http://localhost:3000",
  "http://localhost:3001",
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

// PATCH - Update discount
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

    // ✅ Await params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Discount ID is required" },
        { status: 400, headers }
      );
    }

    const updates = await request.json();

    const currentDiscount = await DiscountCode.findById(id);
    if (!currentDiscount || currentDiscount.storeId !== storeId) {
      return NextResponse.json(
        { success: false, error: "Discount not found or not owned by this store" },
        { status: 404, headers }
      );
    }

    const discountType = updates.type || currentDiscount.type;

    const tagsUpdate = updates.combinesWith !== undefined
      ? {
          tags: [
            discountType === "manual" ? "Manual" : "Automatic",
            updates.combinesWith ? "Combine" : "Doesn't Combine",
          ],
        }
      : {};

    const discount = await DiscountCode.findOneAndUpdate(
      { _id: id, storeId },
      { ...updates, $set: tagsUpdate },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, discount },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("PATCH discount code error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to update discount" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// DELETE - Delete discount
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

    // ✅ Await params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Discount ID is required" },
        { status: 400, headers }
      );
    }

    const discount = await DiscountCode.findOneAndDelete({ _id: id, storeId });

    if (!discount) {
      return NextResponse.json(
        { success: false, error: "Discount not found or not owned by this store" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { success: true, message: "Discount deleted successfully" },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("DELETE discount code error:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { success: false, error: "Failed to delete discount" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
