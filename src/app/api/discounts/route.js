import { NextResponse } from "next/server";
import { getAllDiscounts } from "@/lib/shopify/discounts";

export async function GET() {
  try {
    const discounts = await getAllDiscounts();

    return NextResponse.json({
      success: true,
      discounts,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
