// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/db";
// import SuggestedProduct from "@/models/SuggestedProduct";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";

// export async function GET(req) {
//   await connectToDB();

//   // 1️⃣ Authorization
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = verifyToken(token);

//   if (!decoded) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }

//   // 2️⃣ Load admin/user
//   const admin = await User.findOne({ email: decoded.email });

//   if (!admin) {
//     return NextResponse.json({ error: "Admin not found" }, { status: 404 });
//   }

//   try {
//     // 3️⃣ Query params
//     const { searchParams } = new URL(req.url);
//     const activeOnly = searchParams.get("activeOnly") ?? "true";

//     const query = activeOnly === "true" ? { isActive: true } : {};

//     // 4️⃣ Fetch suggested products
//     const products = await SuggestedProduct.find(query)
//       .sort({ displayOrder: 1, createdAt: -1 })
//       .lean();

//     return NextResponse.json({
//       success: true,
//       products,
//       count: products.length,
//     });
//   } catch (err) {
//     return NextResponse.json(
//       {
//         error: "Failed to fetch suggested products",
//         details: err.message,
//       },
//       { status: 500 }
//     );
//   }
// }




// app/api/suggested/list/route.js

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import SuggestedProduct from "@/models/SuggestedProduct";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  await connectToDB();

  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("activeOnly") ?? "true";
    const requestedVendor = searchParams.get("vendor"); 

    let vendor = null;
    let isAdminRequest = false;

    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      if (decoded) {
        const admin = await User.findOne({ email: decoded.email }).select("shopUrl vendorName");
        if (admin) {
          isAdminRequest = true;

         
          if (admin.vendorName) {
            vendor = admin.vendorName;
          } else if (admin.shopUrl) {
            vendor = admin.shopUrl
              .replace(".myshopify.com", "")
              .split("-")[0]
              .charAt(0)
              .toUpperCase() + admin.shopUrl.replace(".myshopify.com", "").split("-")[0].slice(1);
          }
        }
      }
    }

 
    
   if (requestedVendor) {
      const lower = requestedVendor.toLowerCase();
      if (lower === "all" && isAdminRequest) {
        vendor = null; // Admin explicitly wants all vendors
      } else if (lower !== "all") {
        vendor = requestedVendor.trim(); // Force this vendor (e.g., "Swing")
      }
    }

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not identified" },
        { status: 400 }
      );
    }

    // Final query
    let query = { vendor };

    if (activeOnly === "true") {
      query.isActive = true;
    }

    if (isAdminRequest && requestedVendor && requestedVendor.toLowerCase() === "all") {
      delete query.vendor; 
    }

    const products = await SuggestedProduct.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      currentVendor: vendor,  
      isAdmin: isAdminRequest,
    });
  } catch (err) {
    console.error("Error fetching suggested products:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch suggested products",
        details: err.message,
      },
      { status: 500 }
    );
  }
}