// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import BrochureDownload from "@/models/BrochureDownload";

// export async function GET() {
//   try {
//     await connectDB();

//     const downloads = await BrochureDownload.find({})
//       .sort({ createdAt: -1 }) // newest first
//       .select("name email phone store createdAt")
//       .lean();

//     return NextResponse.json(
//       { success: true, data: downloads },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Failed to fetch brochure downloads:", error);

//     return NextResponse.json(
//       { success: false, message: "Failed to load brochure downloads" },
//       { status: 500 }
//     );
//   }
// }



// app/api/brochure-download-admin/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BrochureDownload from "@/models/BrochureDownload";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Get logged-in user's email (आपके auth method के according adjust करें)
    const email = req.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Find user and get their store
    const user = await User.findOne({ email }).select("shopUrl shopName");

    if (!user || !user.shopUrl) {
      return NextResponse.json(
        { success: false, message: "Store not found for this user" },
        { status: 404 }
      );
    }

    const userStore = user.shopUrl; 

    // ✅ Fetch only downloads for THIS store
    const downloads = await BrochureDownload.find({ store: userStore })
      .sort({ createdAt: -1 })
      .select("name email phone store createdAt")
      .lean();

    return NextResponse.json({
      success: true,
      data: downloads,
      storeName: user.shopName || userStore.split(".")[0], // nice name
      total: downloads.length,
    });
  } catch (error) {
    console.error("❌ Failed to fetch brochure downloads:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}