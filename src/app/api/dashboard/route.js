export const dynamic = "force-dynamic";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import fetch from "node-fetch";

export async function GET(req) {
  await connectToDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded)
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  console.log(decoded)

  // Fetch admin from users collection
  const admin = await User.findOne({ email: decoded.email.trim() })

  console.log("Decoded token:", admin);

  if (!admin) {
    console.log("Admin not found for email:", decoded.email);
    return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
  }

  if (!admin.accessToken || !admin.shopUrl) {
    console.log("Admin credentials missing:", admin);
    return new Response(JSON.stringify({ error: "Shopify credentials missing" }), { status: 400 });
  }

  const SHOPIFY_URL = `https://${admin.shopUrl}/admin/api/2025-10`;

  try {
    // Fetch recent customers
    const customerRes = await fetch(`${SHOPIFY_URL}/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": admin.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          {
            customers(first: 10, sortKey: CREATED_AT, reverse: true) {
              edges { node { id email firstName lastName createdAt } }
            }
          }
        `,
      }),
    });

    const customerJson = await customerRes.json();
    const recentCustomers = customerJson.data?.customers?.edges?.map(e => e.node) || [];

    // Fetch orders
    const ordersRes = await fetch(`${SHOPIFY_URL}/orders.json`, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": admin.accessToken,
        "Content-Type": "application/json",
      },
    });

    const ordersData = await ordersRes.json();
    const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentOrders = orders.filter(order => new Date(order.created_at) >= thirtyDaysAgo);

    const prepaidCount = orders.filter(o => o.financial_status === "paid").length;
    const pendingCount = orders.filter(o => o.financial_status === "pending").length;

    // Fetch refunds
    const refunds = [];
    for (const order of recentOrders.slice(0, 10)) {
      if (order.refunds?.length) {
        order.refunds.forEach(refund => {
          refunds.push({
            id: refund.id,
            orderId: order.id,
            orderName: order.name,
            amount: refund.total_refunded_amount || refund.amount,
            createdAt: refund.created_at,
          });
        });
      }
    }

    refunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const dashboard = {
      customers: {
        total: recentCustomers.length > 0 ? "100+" : recentCustomers.length,
        recent: recentCustomers,
      },
      orders: {
        total: orders.length,
        prepaidCount,
        pendingCount,
        recent: recentOrders.map(o => ({
          id: o.id,
          name: o.name,
          total: parseFloat(o.total_price),
          status: o.financial_status,
          createdAt: o.created_at,
        })),
      },
      refunds: {
        total: refunds.length,
        recent: refunds.slice(0, 10),
      },
    };

    return new Response(JSON.stringify({ dashboard }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch dashboard data", details: err.message }),
      { status: 500 }
    );
  }
}
