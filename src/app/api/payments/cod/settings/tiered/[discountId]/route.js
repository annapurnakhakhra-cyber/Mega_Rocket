import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import CodSettings from "@/models/CodSettings";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const storeId = request.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID is required" },
        { status: 400 }
      );
    }

    const discountId = new mongoose.Types.ObjectId(params.discountId);
    const payload = await request.json();

    // 🔒 Strip forbidden fields (VERY IMPORTANT)
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    const settings = await CodSettings.findOneAndUpdate(
      {
        storeId,
        "tiered.discounts._id": discountId,
      },
      {
        $set: {
          "tiered.discounts.$.paymentMethod": payload.paymentMethod,
          "tiered.discounts.$.discountCode": payload.discountCode,
          "tiered.discounts.$.discountType": payload.discountType,
          "tiered.discounts.$.lowerLimit": payload.lowerLimit,
          "tiered.discounts.$.upperLimit": payload.upperLimit,
          "tiered.discounts.$.discountValue": payload.discountValue,
          "tiered.discounts.$.freebies": payload.freebies,
          "tiered.discounts.$.rtoDriven": payload.rtoDriven,
          "tiered.discounts.$.capping": payload.capping,
          "tiered.discounts.$.isActive": payload.isActive,
        },
      },
      { new: true }
    );

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Discount not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tiered discount updated successfully",
      settings,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
