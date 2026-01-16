import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CodSettings from "@/models/CodSettings";

export async function POST(request) {
  try {
    await connectDB();

    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID required" },
        { status: 400 }
      );
    }

    const payload = await request.json();

    // 🔒 Validation (matches your UI & earlier errors)
    if (
      !payload.paymentMethod ||
      !payload.discountCode ||
      !payload.discountType ||
      payload.lowerLimit === undefined ||
      payload.discountValue === undefined ||
      payload.capping === undefined
    ) {
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 }
      );
    }

    const settings = await CodSettings.findOneAndUpdate(
      { storeId },
      {
        $push: {
          "tiered.discounts": payload,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Tiered discount added",
      settings,
    });
  } catch (error) {
    console.error("Add Tiered Discount error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add tiered discount" },
      { status: 500 }
    );
  }
}
