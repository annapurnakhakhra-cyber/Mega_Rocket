import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DiscountSet from "@/models/DiscountSet";
import DiscountCode from "@/models/DiscountCode";

function generateCode(length = 12, prefix = "", suffix = "") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  const effectiveLength = Math.max(4, Math.min(20, parseInt(length) || 12));

  for (let i = 0; i < effectiveLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix || ""}${result}${suffix || ""}`.toUpperCase();
}

export async function POST(req) {
  try {
    await connectDB();

    const storeId = req.headers.get("x-store-id");
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: "Store ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Discount title is required" },
        { status: 400 }
      );
    }

    if (!body.discountType) {
      return NextResponse.json(
        { success: false, error: "Discount type is required" },
        { status: 400 }
      );
    }

    console.log("Request Body Summary:", {
      storeId,
      title: body.title,
      discountType: body.discountType,
      numberOfCodes: body.numberOfCodes,
      codeLength: body.codeLength,
      prefix: body.prefix,
      suffix: body.suffix,
    });

    // 1️⃣ Create Discount Set
    const discountSet = await DiscountSet.create({
      storeId,
      title: body.title.trim().toUpperCase(),
      discountType: body.discountType,
      metadata: body,
    });

    console.log("Created Discount Set:", discountSet._id);

    // 2️⃣ Determine how many codes to generate
    const numCodes = parseInt(body.numberOfCodes) || 0;

    if (numCodes <= 0) {
      return NextResponse.json({
        success: true,
        message: "Discount set created (no codes generated)",
        discountSetId: discountSet._id,
        totalCodes: 0,
      });
    }

    if (numCodes > 50000) {
      return NextResponse.json(
        { success: false, error: "Maximum 50,000 codes allowed per request" },
        { status: 400 }
      );
    }

    // Safe values
    const prefix = (body.prefix || "").trim().toUpperCase();
    const suffix = (body.suffix || "").trim().toUpperCase();
    const codeLength = parseInt(body.codeLength) || 12;

    // 3️⃣ Generate unique codes
    const codes = new Set();
    while (codes.size < numCodes) {
      const newCode = generateCode(codeLength, prefix, suffix);
      if (newCode.length >= 4) {
        codes.add(newCode);
      }
    }

    const uniqueCodes = Array.from(codes);
    console.log(`Generated ${uniqueCodes.length} unique codes`);

    // 4️⃣ Prepare bulk insert payload
    const discountCodesPayload = uniqueCodes.map((code) => ({
      storeId,
      code, // Guaranteed to be a valid string now
      type: "bulk",
      bulkSetId: discountSet._id,
      status: "active",
      visibility: false,
      metadata: {
        discountValue: body.discountValue || 0,
        discountSelectType: body.discountSelectType || "percentage",
        minRequirement: body.minRequirement || "none",
        applicableOn: body.applicableOn || "all",
        // Add more metadata as needed
      },
    }));

    // 5️⃣ Insert codes with duplicate handling (safe insert)
    try {
      await DiscountCode.insertMany(discountCodesPayload, { ordered: false });
    } catch (insertError) {
      // If some codes are duplicates, log but don't fail entirely
      if (insertError.code === 11000) {
        console.warn("Some codes were duplicates and skipped:", insertError.message);
        // Optionally: retry generating missing ones (advanced)
      } else {
        throw insertError; // re-throw if it's a different error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bulk discount created successfully",
      discountSetId: discountSet._id,
      totalCodesGenerated: uniqueCodes.length,
      totalCodesInserted: uniqueCodes.length, // You can refine this if needed
    });
  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.code === 11000
            ? "Some discount codes already exist. Try different prefix/suffix."
            : error.message || "Failed to create bulk discount",
      },
      { status: 500 }
    );
  }
}