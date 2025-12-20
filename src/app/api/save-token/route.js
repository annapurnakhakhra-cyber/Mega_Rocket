// /app/api/save-token/route.js
import connectToDB from "@/lib/db";
import ShopToken from "@/models/ShopToken";

export async function POST(req) {
  console.log("🔥 POST /api/save-token");

  try {
    await connectToDB();
    console.log("✅ DB Connected");

    const body = await req.json();
    const { shopDomain, accessToken } = body;

    if (!shopDomain || !accessToken) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const saved = await ShopToken.findOneAndUpdate(
      { shopDomain },
      { shopDomain, accessToken },
      { upsert: true, new: true }
    );

    return Response.json(
      { message: "Token saved successfully", data: saved },
      { status: 200 }
    );
  } catch (err) {
    console.error("💥 API ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}