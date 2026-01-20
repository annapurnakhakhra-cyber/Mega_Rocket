export const dynamic = "force-dynamic";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import fetch from "node-fetch";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET orders
export async function GET(req) {
  try {
    await connectToDB();

    // Authorization check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Get admin / Shopify credentials
    const admin = await User.findOne({ email: decoded.email }).select(
      "+accessToken +shopUrl"
    );

    if (!admin) {
      return new Response(JSON.stringify({ error: "Admin not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (!admin.accessToken || !admin.shopUrl) {
      return new Response(
        JSON.stringify({ error: "Shopify credentials missing" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // GraphQL query with full address and pricing details
    const graphqlQuery = {
      query: `
        {
          orders(first: 250, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                id
                name
                createdAt
                displayFulfillmentStatus
                displayFinancialStatus

                currentTotalPriceSet { shopMoney { amount currencyCode } }
                totalPriceSet { shopMoney { amount currencyCode } }
                subtotalPriceSet { shopMoney { amount currencyCode } }
                totalShippingPriceSet { shopMoney { amount currencyCode } }
                totalTaxSet { shopMoney { amount currencyCode } }
                totalOutstandingSet { shopMoney { amount currencyCode } }

                app { name }
                publication { name }
                tags

                customer { 
                  firstName 
                  lastName 
                  email 
                  phone
                }

                lineItems(first: 250) {
                  edges {
                    node {
                      title
                      quantity
                      discountedTotalSet { shopMoney { amount currencyCode } }
                      originalTotalSet { shopMoney { amount currencyCode } }
                    }
                  }
                }

                shippingLines(first: 10) {
                  edges {
                    node {
                      title
                      code
                    }
                  }
                }

                shippingAddress {
                  name
                  address1
                  address2
                  city
                  province
                  zip
                  country
                  phone
                }

                sourceIdentifier
              }
            }
          }
        }
      `,
    };

    // Shopify API call
    const shopifyRes = await fetch(
      `https://${admin.shopUrl}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": admin.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    );

    const result = await shopifyRes.json();

    if (result.errors) {
      console.error("Shopify GraphQL Errors:", result.errors);
      return new Response(
        JSON.stringify({
          error: "Shopify GraphQL errors",
          details: result.errors,
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const edges = result?.data?.orders?.edges || [];

    // Enhanced mapping with full address and pricing breakdown
    const orders = edges.map((edge) => {
      const o = edge.node;

      // Phone priority: shipping > customer profile
      const phone = o.shippingAddress?.phone || o.customer?.phone || null;

      // Full shipping address
      const shippingAddress = o.shippingAddress ? {
        name: o.shippingAddress.name || "",
        address1: o.shippingAddress.address1 || "",
        address2: o.shippingAddress.address2 || "",
        city: o.shippingAddress.city || "",
        province: o.shippingAddress.province || "",
        zip: o.shippingAddress.zip || "",
        country: o.shippingAddress.country || "",
        phone: o.shippingAddress.phone || null,
      } : null;

      // Delivery method
      const deliveryMethod =
        o.shippingLines?.edges?.[0]?.node?.title ||
        o.shippingLines?.edges?.[0]?.node?.code ||
        "Standard Shipping";

      return {
        id: o.id.split("/").pop(), // Clean numeric ID
        name: o.name,
        createdAt: o.createdAt,
        fulfillmentStatus: o.displayFulfillmentStatus || "UNFULFILLED",
        financialStatus: o.displayFinancialStatus || "PENDING",

        // Pricing details
        subtotal: parseFloat(o.subtotalPriceSet?.shopMoney?.amount || "0.00").toFixed(2),
        shippingCost: parseFloat(o.totalShippingPriceSet?.shopMoney?.amount || "0.00").toFixed(2),
        tax: parseFloat(o.totalTaxSet?.shopMoney?.amount || "0.00").toFixed(2),
        total: parseFloat(o.currentTotalPriceSet?.shopMoney?.amount || "0.00").toFixed(2),
        originalTotal: parseFloat(o.totalPriceSet?.shopMoney?.amount || "0.00").toFixed(2),
        outstanding: parseFloat(o.totalOutstandingSet?.shopMoney?.amount || "0.00").toFixed(2),
        currency: o.currentTotalPriceSet?.shopMoney?.currencyCode || "INR",

        channel: o.publication?.name || o.app?.name || "Online Store",
        tags: o.tags?.join(", ") || "",

        customer: o.customer ? {
          firstName: o.customer.firstName || null,
          lastName: o.customer.lastName || null,
          email: o.customer.email || null,
          phone: phone,
        } : null,

        shippingAddress: shippingAddress,

        deliveryStatus: o.displayFulfillmentStatus || "Not Delivered",
        deliveryMethod: deliveryMethod,

        items: o.lineItems?.edges?.map((i) => {
          const item = i.node;
          const unitPrice = item.quantity > 0
            ? (parseFloat(item.discountedTotalSet?.shopMoney?.amount || 0) / item.quantity).toFixed(2)
            : "0.00";

          return {
            title: item.title || "Unknown Product",
            quantity: item.quantity || 1,
            price: unitPrice, // per unit after discount
            total: parseFloat(item.discountedTotalSet?.shopMoney?.amount || "0.00").toFixed(2),
            originalTotal: parseFloat(item.originalTotalSet?.shopMoney?.amount || "0.00").toFixed(2),
          };
        }) || [],
      };
    });

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Orders API Error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch orders",
        details: err.message,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
