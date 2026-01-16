import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 
import ShippingSettings from "@/models/ShippingSettings"; 

// POST: Enable/Disable Discount Based Shipping
export async function POST(request) {
  try {
    await dbConnect();

    const { enabled } = await request.json();

    // Validation: enabled must be boolean
    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "enabled must be a boolean (true/false)" },
        { status: 400 }
      );
    }

    const STORE_ID = "annapurnakhakhra";

    // Find or create settings document for this store
    const updatedSettings = await ShippingSettings.findOneAndUpdate(
      { storeId: STORE_ID },
      { $set: { discountEnabled: enabled } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Discount Based Shipping ${enabled ? "enabled" : "disabled"} successfully`,
      data: { discountEnabled: updatedSettings.discountEnabled },
    });
  } catch (error) {
    console.error("Error updating discount enabled status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// Optional: GET method to fetch current status (useful for initial load)
export async function GET() {
  try {
    await dbConnect();

    const STORE_ID = "annapurnakhakhra";

    const settings = await ShippingSettings.findOne({ storeId: STORE_ID });

    return NextResponse.json({
      success: true,
      discountEnabled: settings?.discountEnabled || false,
    });
  } catch (error) {
    console.error("Error fetching discount enabled status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}