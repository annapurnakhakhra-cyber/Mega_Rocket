export const dynamic = "force-dynamic";

import connectToDB  from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import fetch from "node-fetch";

export async function GET(req) {
  await connectToDB();

  // 1️⃣ Auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return Response.json({ error: "Invalid token" }, { status: 401 });

  // 2️⃣ Admin Shopify credentials
  const admin = await User.findOne({ email: decoded.email }).select("+accessToken +shopUrl");
  if (!admin) return Response.json({ error: "Admin not found" }, { status: 404 });
  if (!admin.accessToken || !admin.shopUrl)
    return Response.json({ error: "Shopify credentials missing" }, { status: 400 });

  // 3️⃣ Shopify GraphQL query
  const graphqlQuery = {
    query: `
      {
        orders(first: 250, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              currentTotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 50) {
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

  try {
    // 4️⃣ Fetch Shopify orders
    const response = await fetch(
      `https://${admin.shopUrl}/admin/api/2024-10/graphql.json`,
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
      return Response.json({ error: "Shopify GraphQL error", details: result.errors }, { status: 500 });
    }

    const orders = result?.data?.orders?.edges || [];

    // 5️⃣ Filter prepaid orders (PAID)
    const prepaidOrders = orders
      .map(edge => edge.node)
      .filter(o => o.displayFinancialStatus === "PAID")
      .map(o => ({
        id: o.id,
        name: o.name,
        createdAt: o.createdAt,
        financialStatus: o.displayFinancialStatus,
        fulfillmentStatus: o.displayFulfillmentStatus,
        total: o.currentTotalPriceSet?.shopMoney?.amount || "0",
        currency: o.currentTotalPriceSet?.shopMoney?.currencyCode || "",
        items: o.lineItems?.edges?.map(i => ({
          title: i.node.title,
          quantity: i.node.quantity,
        })) || [],
        customer: {
          firstName: o.customer?.firstName || "",
          lastName: o.customer?.lastName || "",
          email: o.customer?.email || "",
        },
      }));

    return Response.json({ prepaidOrders }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Failed to fetch Shopify prepaid orders", details: err.message }, { status: 500 });
  }
}
