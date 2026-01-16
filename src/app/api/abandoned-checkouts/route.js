export const dynamic = "force-dynamic";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import TrackingEvent from "@/models/TrackingEvent"; // Import new model

// POST endpoint for all tracking events (Custom + Recovery)
export async function POST(req) {
  await connectToDB();
  try {
    const body = await req.json();
    const { eventType, ...data } = body; // Destructure for both types

    // Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Save to DB
    const trackingDoc = new TrackingEvent({
      eventType: eventType || 'unknown', // Default if missing
      ...data,
      userId: decoded.id // From JWT
    });
    await trackingDoc.save();

    console.log(`📊 ${eventType || 'event'} Saved:`, { cartId: data.cartId, userId: decoded.id });

    return NextResponse.json({
      success: true,
      message: `${eventType || 'event'} tracked and saved successfully`,
      id: trackingDoc._id
    });
  } catch (err) {
    console.error('Tracking error:', err);
    return NextResponse.json(
      { success: false, error: "Failed to track event: " + err.message },
      { status: 500 }
    );
  }
}

// Single GET endpoint: Handles both abandoned checkouts fetch and tracking export
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  // Check if this is an export request
  if (searchParams.get('export') === 'track') {
    try {
      await connectToDB();

      // Authorization
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
      if (!decoded || !decoded.id) {
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
      }

      // Fetch all tracking events for this user
      const trackingEvents = await TrackingEvent.find({ userId: decoded.id })
        .sort({ createdAt: -1 })
        .limit(1000);

      // Simplified summary (totalCarts can be fetched from Shopify if needed; for now, use a placeholder or calculate based on unique carts)
      const uniqueCarts = [...new Set(trackingEvents.map(ev => ev.cartId))].length;
      const summary = {
        totalCarts: uniqueCarts, // Or integrate Shopify fetch here if required
        recoveryAttempts: trackingEvents.length,
        recoveryRate: uniqueCarts > 0 ? ((trackingEvents.length / uniqueCarts) * 100).toFixed(1) : 0,
        totalValue: trackingEvents.reduce((acc, ev) => acc + (ev.totalValue || 0), 0),
        exportedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        summary,
        trackingLogs: trackingEvents,
        trackedCartIds: trackingEvents.map(ev => ev.cartId)
      });
    } catch (err) {
      console.error('Export error:', err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  // Original logic: Fetch abandoned checkouts from Shopify
  try {
    await connectToDB();
  } catch (dbErr) {
    return NextResponse.json({ success: false, error: "Database connection failed: " + dbErr.message }, { status: 500 });
  }

  // 1️⃣ Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || !decoded.email) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
  // 2️⃣ Load admin Shopify credentials
  const admin = await User.findOne({ email: decoded.email }).select(
    "+accessToken +shopUrl"
  );
  if (!admin) {
    return NextResponse.json({ success: false, error: "Admin not found for email: " + decoded.email }, { status: 404 });
  }
  if (!admin.accessToken || !admin.shopUrl) {
    return NextResponse.json(
      { success: false, error: "Shopify credentials missing. Please set up Shopify integration." },
      { status: 400 }
    );
  }
  // 3️⃣ Parse query parameters
  const { searchParams: params } = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(params.get('limit') || '50'), 1), 250); // Min 1, Max 250
  const afterCursor = params.get('after');
  const allAbandonedCheckouts = [];
  let checkoutCursor = afterCursor;
  let hasNextPage = false;
  try {
    // 3️⃣ Pagination loop
    while (true) {
      const abandonedQuery = {
        query: `
        {
          abandonedCheckouts(first: ${limit}${
          checkoutCursor ? `, after: "${checkoutCursor}"` : ""
        }) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                createdAt
                updatedAt
                completedAt
                abandonedCheckoutUrl
                totalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                }
                customer {
                  id
                  firstName
                  lastName
                  email
                }
                billingAddress { phone }
                shippingAddress { phone }
                lineItems(first: 50) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        title
                        price
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
      };
      const resp = await fetch(
        `https://${admin.shopUrl}/admin/api/2024-10/graphql.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": admin.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(abandonedQuery),
        }
      );
      if (!resp.ok) {
        const errorText = await resp.text();
        return NextResponse.json(
          { success: false, error: `Shopify API error: ${resp.status} ${resp.statusText} - ${errorText}` },
          { status: 500 }
        );
      }
      let data;
      try {
        data = await resp.json();
      } catch (parseErr) {
        return NextResponse.json(
          { success: false, error: "Failed to parse Shopify API response: " + parseErr.message },
          { status: 500 }
        );
      }
      if (data.errors) {
        return NextResponse.json(
          { success: false, error: "Shopify GraphQL returned errors: " + JSON.stringify(data.errors) },
          { status: 500 }
        );
      }
      // Check if data.data exists and has the expected structure
      if (!data.data || !data.data.abandonedCheckouts) {
        return NextResponse.json(
          { success: false, error: "Unexpected Shopify API response structure. Check API credentials and permissions." },
          { status: 500 }
        );
      }
      const abandonedBatch = data.data.abandonedCheckouts.edges.map((e) => e.node);
      // 4️⃣ Normalize data
      const processed = abandonedBatch.map((c) => {
        const lineItems = c.lineItems.edges.map((e) => {
          const unitPrice = parseFloat(e.node.variant?.price || 0);
          const quantity = e.node.quantity;
          return {
            title: e.node.title,
            variantTitle: e.node.variant?.title || "",
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
        });
        const subtotal = lineItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        return {
          id: c.id,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          completedAt: c.completedAt,
          abandonedCheckoutUrl: c.abandonedCheckoutUrl,
          email: c.customer?.email || "",
          phone:
            c.billingAddress?.phone ||
            c.shippingAddress?.phone ||
            "",
          customerId: c.customer?.id || null,
          customerFirstName: c.customer?.firstName || "",
          customerLastName: c.customer?.lastName || "",
          currency:
            c.totalPriceSet.presentmentMoney.currencyCode,
          totalPrice: parseFloat(
            c.totalPriceSet.presentmentMoney.amount
          ),
          subtotalPrice: subtotal,
          lineItems,
        };
      });
      allAbandonedCheckouts.push(...processed);
      // Check if pageInfo exists before accessing it
      if (!data.data.abandonedCheckouts.pageInfo) {
        hasNextPage = false;
        break; // Stop pagination if no pageInfo
      }
      hasNextPage = data.data.abandonedCheckouts.pageInfo.hasNextPage;
      if (!hasNextPage) break;
      checkoutCursor = data.data.abandonedCheckouts.pageInfo.endCursor;
    }
    // Transform data to match frontend expectations
    const transformedData = allAbandonedCheckouts.map(checkout => ({
      id: checkout.id.split('/').pop(),
      timestamp: checkout.createdAt,
      customerName: `${checkout.customerFirstName} ${checkout.customerLastName}`.trim() || 'Unknown Customer',
      email: checkout.email,
      totalValue: `${checkout.currency} ${checkout.totalPrice.toFixed(2)}`,
      totalNumeric: checkout.totalPrice,
      recoveryUrl: checkout.abandonedCheckoutUrl,
      items: checkout.lineItems.map(item => ({
        title: item.title,
        variant: item.variantTitle,
        unitPrice: `${checkout.currency} ${item.unitPrice.toFixed(2)}`,
        quantity: item.quantity,
        image: null // We'll need to fetch this separately if needed
      }))
    }));
    return NextResponse.json({
      success: true,
      data: transformedData,
      pageInfo: {
        endCursor: checkoutCursor,
        hasNextPage: hasNextPage
      }
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Shopify abandoned checkouts: " + err.message,
      },
      { status: 500 }
    );
  }
}