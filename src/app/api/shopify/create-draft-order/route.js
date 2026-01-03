import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AbandonedCheckout from "@/models/AbandonedCheckout";
import User from "@/models/User";

const SHOPIFY_API_VERSION = "2024-04";

export async function POST(req) {
  try {
    await connectDB();

    const { checkoutId, adminEmail } = await req.json();

    if (!checkoutId || !adminEmail) {
      return NextResponse.json(
        { error: "checkoutId and adminEmail required" },
        { status: 400 }
      );
    }

    /* ================= LOAD ADMIN ================= */
    const admin = await User.findOne({ email: adminEmail.trim() });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    if (!admin.shopUrl || !admin.accessToken) {
      return NextResponse.json(
        { error: "Shopify credentials missing for this admin" },
        { status: 400 }
      );
    }

    const SHOP_URL = admin.shopUrl
      .replace("https://", "")
      .replace("http://", "")
      .trim();

    const ADMIN_ACCESS_TOKEN = admin.accessToken;

    /* ================= LOAD CHECKOUT ================= */
    const checkout = await AbandonedCheckout.findById(checkoutId);

    if (!checkout) {
      return NextResponse.json(
        { error: "Checkout not found" },
        { status: 404 }
      );
    }

    /* ================= LINE ITEMS ================= */
    const lineItems = (checkout.cart?.items || []).map(item => ({
      variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
      quantity: item.quantity,
    }));

    if (!lineItems.length) {
      return NextResponse.json(
        { error: "Checkout has no items" },
        { status: 400 }
      );
    }

    /* ================= CREATE DRAFT ORDER ================= */
    const res = await fetch(
      `https://${SHOP_URL}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: `
            mutation draftOrderCreate($input: DraftOrderInput!) {
              draftOrderCreate(input: $input) {
                draftOrder {
                  id
                  name
                  createdAt
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              email: checkout.customer?.email,
              lineItems,
              shippingAddress: checkout.address || undefined,
              note: "Created from abandoned checkout",
              tags: ["abandoned-checkout"],
            },
          },
        }),
      }
    );

    const data = await res.json();

    /* ================= ERROR HANDLING ================= */
    const errors =
      data?.errors || data?.data?.draftOrderCreate?.userErrors;

    if (errors?.length) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const draftOrder = data.data.draftOrderCreate.draftOrder;

    /* ================= SAVE ================= */
    await AbandonedCheckout.findByIdAndUpdate(checkoutId, {
      status: "draft_created",
      draftOrderId: draftOrder.id,
      recoveredAt: new Date(),
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      message: "Draft order created successfully",
      draftOrderId: draftOrder.id,
      draftOrderName: draftOrder.name,
    });

  } catch (err) {
    console.error("🔥 CREATE DRAFT ORDER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
