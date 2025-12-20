// Backend API Route: /api/orders/pending/route.js
import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Shopify max allowed
const ORDER_BATCH_SIZE = 250;

export async function GET(req) {
  await connectToDB();

  /* ---------------- AUTH ---------------- */
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  /* -------------- ADMIN ----------------- */
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

  /* -------------- LOGIC ----------------- */
  const allPendingOrders = [];
  let orderCursor = null;

  // Shopify server-side filter
  const filterQuery =
    "fulfillment_status:unfulfilled OR fulfillment_status:partial";

  try {
    while (true) {
      const graphqlQuery = {
        query: `
          {
            orders(
              first: ${ORDER_BATCH_SIZE}
              ${orderCursor ? `, after: "${orderCursor}"` : ""}
              query: "${filterQuery}"
              sortKey: CREATED_AT
              reverse: true
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  name
                  createdAt
                  displayFulfillmentStatus
                  displayFinancialStatus
                  paymentGatewayNames
                  currentTotalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  lineItems(first: 250) {
                    edges {
                      node {
                        title
                        quantity
                      }
                    }
                  }
                  customer {
                    firstName
                    lastName
                    email
                  }
                }
              }
            }
          }
        `,
      };

      const response = await fetch(
        `https://${admin.shopUrl}/admin/api/2025-10/graphql.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": admin.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphqlQuery),
        }
      );

      const result = await response.json();

      if (result.errors) {
        return NextResponse.json(
          { error: "Shopify GraphQL errors", details: result.errors },
          { status: 500 }
        );
      }

      const edges = result?.data?.orders?.edges || [];

      const pendingOrders = edges.map(({ node }) => ({
        id: node.id,
        name: node.name,
        createdAt: node.createdAt,
        fulfillmentStatus: node.displayFulfillmentStatus,
        financialStatus: node.displayFinancialStatus,
        paymentGatewayNames: node.paymentGatewayNames || [],
        total: node.currentTotalPriceSet?.shopMoney?.amount || "0",
        currency:
          node.currentTotalPriceSet?.shopMoney?.currencyCode || "INR",
        items:
          node.lineItems?.edges?.map((i) => ({
            title: i.node.title,
            quantity: i.node.quantity,
          })) || [],
        customer: {
          firstName: node.customer?.firstName || "",
          lastName: node.customer?.lastName || "",
          email: node.customer?.email || "",
        },
      }));

      allPendingOrders.push(...pendingOrders);

      if (!result.data.orders.pageInfo.hasNextPage) break;
      orderCursor = result.data.orders.pageInfo.endCursor;
    }

    return NextResponse.json({ pendingOrders: allPendingOrders });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch Shopify pending orders",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
