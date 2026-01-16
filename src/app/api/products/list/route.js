export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { getAllProducts } from "@/lib/shopify";

export async function GET(req) {
  await connectToDB();

  // 1️⃣ Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // 2️⃣ Load admin
  const admin = await User.findOne({ email: decoded.email }).select(
    "+accessToken +shopUrl"
  );

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  if (!admin.accessToken || !admin.shopUrl) {
    return NextResponse.json(
      { error: "Shopify credentials missing" },
      { status: 400 }
    );
  }

  try {
    // 3️⃣ Query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 100;

    // 4️⃣ Fetch products from Shopify
    const products = await getAllProducts(limit, {
      accessToken: admin.accessToken,
      shopUrl: admin.shopUrl,
    });

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (err) {
    console.error("Error fetching products:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
