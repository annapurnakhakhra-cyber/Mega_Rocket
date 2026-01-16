// export const dynamic = "force-dynamic";

// import connectToDB from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";
// import fetch from "node-fetch";

// const SHOPIFY_API_VERSION = "2024-10";

// export async function GET(req) {
//   try {
//     await connectToDB();

//     /* ================= AUTH ================= */
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid Authorization header" }), {
//         status: 401,
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);

//     if (!decoded?.email) {
//       return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
//     }

//     /* ================= ADMIN CHECK ================= */
//     const admin = await User.findOne({ email: decoded.email.trim() });

//     if (!admin) {
//       return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
//     }

//     if (!admin.accessToken || !admin.shopUrl) {
//       return new Response(JSON.stringify({ error: "Shopify credentials not configured", data : admin }), {
//         status: 400,
//       });
//     }

//     /* ================= SHOPIFY BASE URL ================= */
//     const cleanShopUrl = admin.shopUrl.replace(/^https?:\/\//, "").trim();
//     const SHOPIFY_ADMIN_URL = `https://${cleanShopUrl}/admin/api/${SHOPIFY_API_VERSION}`;

//     /* ================= FETCH RECENT CUSTOMERS (GraphQL) ================= */
//     const customerResponse = await fetch(`${SHOPIFY_ADMIN_URL}/graphql.json`, {
//       method: "POST",
//       headers: {
//         "X-Shopify-Access-Token": admin.accessToken,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: `
//           query {
//             customers(first: 10, sortKey: CREATED_AT, reverse: true) {
//               edges {
//                 node {
//                   id
//                   email
//                   firstName
//                   lastName
//                   createdAt
//                   displayName
//                 }
//               }
//             }
//           }
//         `,
//       }),
//     });

//     const customerData = await customerResponse.json();

//     if (customerData.errors || !customerResponse.ok) {
//       console.error("Shopify Customer GraphQL Error:", customerData.errors || await customerResponse.text());
//       return new Response(JSON.stringify({ error: "Failed to fetch customers", details: customerData.errors }), {
//         status: 400,
//       });
//     }

//     const recentCustomers = customerData.data.customers.edges.map(edge => edge.node);

//     /* ================= FETCH ORDERS (REST) ================= */
//     const ordersResponse = await fetch(`${SHOPIFY_ADMIN_URL}/orders.json?limit=250&status=any`, {
//       headers: {
//         "X-Shopify-Access-Token": admin.accessToken,
//         "Content-Type": "application/json",
//       },
//     });

//     let orders = [];
//     if (ordersResponse.ok) {
//       const ordersJson = await ordersResponse.json();
//       orders = ordersJson.orders || [];
//     } else {
//       console.error("Orders fetch failed:", await ordersResponse.text());
//       // Continue even if orders fail — maybe partial data is useful
//     }

//     /* ================= FETCH REFUNDS FROM ORDERS ================= */
//     const refunds = [];
//     orders.forEach(order => {
//       if (order.refunds && order.refunds.length > 0) {
//         order.refunds.forEach(refund => {
//           refunds.push({
//             refundId: refund.id,
//             orderId: order.id,
//             orderName: order.name,
//             amount: refund.total_refunded || refund.transactions?.[0]?.amount || "0.00",
//             createdAt: refund.created_at,
//             processedAt: refund.processed_at,
//             status: refund.status,
//           });
//         });
//       }
//     });

//     // Sort refunds newest first
//     refunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     /* ================= FINAL RAW PAYLOAD RESPONSE ================= */
//     return new Response(
//       JSON.stringify(
//         {
//           success: true,
//           fetchedAt: new Date().toISOString(),
//           shop: cleanShopUrl,
//           data: {
//             customers: {
//               recent: recentCustomers,
//               count: recentCustomers.length,
//             },
//             orders: {
//               totalFetched: orders.length,
//               recent30Days: orders.filter(o => new Date(o.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
//               all: orders.map(o => ({
//                 id: o.id,
//                 name: o.name,
//                 total_price: o.total_price,
//                 financial_status: o.financial_status,
//                 created_at: o.created_at,
//                 customer: o.customer ? {
//                   id: o.customer.id,
//                   email: o.customer.email,
//                   first_name: o.customer.first_name,
//                   last_name: o.customer.last_name,
//                 } : null,
//                 refunds: o.refunds || [],
//               })),
//             },
//             refunds: {
//               total: refunds.length,
//               recent: refunds.slice(0, 20), // More than 10 for full visibility
//               all: refunds,
//             },
//           },
//         },
//         null,
//         2
//       ),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//   } catch (err) {
//     console.error("Dashboard API Internal Error:", err);
//     return new Response(
//       JSON.stringify({
//         error: "Internal server error",
//         message: err.message,
//         stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//       }),
//       { status: 500 }
//     );
//   }
// }


export const dynamic = "force-dynamic";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import fetch from "node-fetch";

const SHOPIFY_API_VERSION = "2024-10";

export async function GET(req) {
  try {
    await connectToDB();

    /* ================= AUTH ================= */
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded?.email) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    /* ================= ADMIN ================= */
    const admin = await User.findOne({ email: decoded.email.trim() });

    if (!admin) {
      return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
    }

    if (!admin.accessToken || !admin.shopUrl) {
      return new Response(
        JSON.stringify({ error: "Shopify credentials missing" }),
        { status: 400 }
      );
    }

    /* ================= SHOPIFY URL ================= */
    const cleanShopUrl = admin.shopUrl
      .replace("https://", "")
      .replace("http://", "")
      .trim();

    const SHOPIFY_URL = `https://${cleanShopUrl}/admin/api/${SHOPIFY_API_VERSION}`;

    /* ================= CUSTOMERS (GRAPHQL) ================= */
    const customerRes = await fetch(`${SHOPIFY_URL}/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": admin.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            customers(first: 10, sortKey: CREATED_AT, reverse: true) {
              edges {
                node {
                  id
                  email
                  firstName
                  lastName
                  createdAt
                }
              }
            }
          }
        `,
      }),
    });

    if (!customerRes.ok) {
      const text = await customerRes.text();
      console.error("Shopify GraphQL error:", text);
      return new Response(
        JSON.stringify({ error: "Shopify GraphQL errors", details: text }),
        { status: customerRes.status }
      );
    }

    const customerJson = await customerRes.json();

    if (customerJson.errors) {
      return new Response(
        JSON.stringify({
          error: "Shopify GraphQL errors",
          details: customerJson.errors,
        }),
        { status: 400 }
      );
    }

    const recentCustomers =
      customerJson.data?.customers?.edges?.map(e => e.node) || [];

    /* ================= ORDERS (REST) ================= */
    const ordersRes = await fetch(`${SHOPIFY_URL}/orders.json?limit=250`, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": admin.accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!ordersRes.ok) {
      const text = await ordersRes.text();
      console.error("Orders fetch error:", text);
      return new Response(
        JSON.stringify({ error: "Failed to fetch orders", details: text }),
        { status: ordersRes.status }
      );
    }

    const ordersData = await ordersRes.json();
    const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];

    /* ================= STATS ================= */
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentOrders = orders.filter(
      o => new Date(o.created_at) >= thirtyDaysAgo
    );

    const prepaidCount = orders.filter(o => o.financial_status === "paid").length;
    const pendingCount = orders.filter(o => o.financial_status === "pending").length;

    /* ================= REFUNDS ================= */
    const refunds = [];

    recentOrders.forEach(order => {
      if (order.refunds?.length) {
        order.refunds.forEach(refund => {
          refunds.push({
            id: refund.id,
            orderId: order.id,
            orderName: order.name,
            amount: refund.transactions?.[0]?.amount || "0.00",
            createdAt: refund.created_at,
          });
        });
      }
    });

    refunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    /* ================= RESPONSE ================= */
    const dashboard = {
      customers: {
        total: recentCustomers.length,
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

    // Include logged-in user info
    const responseData = {
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        shopUrl: admin.shopUrl,
        // add roles or permissions here if needed
      },
      dashboard,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Dashboard API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500 }
    );
  }
}
