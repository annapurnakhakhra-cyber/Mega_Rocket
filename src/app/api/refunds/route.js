import connectToDB  from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import fetch from "node-fetch";

export const dynamic = "force-dynamic";

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
        orders(first: 50) {
          edges {
            node {
              id
              name
              refunds {
                id
                createdAt
                note
                transactions(first: 10) {
                  edges {
                    node {
                      id
                      amountSet {
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
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

  try {
    // 4️⃣ Fetch from Shopify
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

    // 5️⃣ Map refunds
    const refunds = orders.flatMap(order =>
      order.node.refunds.map(r => ({
        orderId: order.node.id,
        orderName: order.node.name,
        refundId: r.id,
        createdAt: r.createdAt,
        note: r.note,
        transactions: r.transactions.edges.map(t => ({
          id: t.node.id,
          amount: t.node.amountSet.shopMoney.amount,
          currency: t.node.amountSet.shopMoney.currencyCode,
        })),
      }))
    );

    return Response.json({ refunds }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Failed to fetch Shopify refunds", details: err.message }, { status: 500 });
  }
}
