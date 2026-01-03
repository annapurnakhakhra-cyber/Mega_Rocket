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
    if (!authHeader) {
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

    // Shopify GraphQL query - Full fields for screenshot match
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

                app { name }  # For channel if publication not available
                publication { name }  # Channel
                tags

                customer { firstName lastName email }

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

                shippingLines(first: 10) {  # Delivery method
                  edges {
                    node {
                      title
                      code  # Additional for method
                    }
                  }
                }

                shippingAddress {
                  name address1 address2 city province zip country
                }

                sourceIdentifier  # For delivery status if needed
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

    // Clean formatted response - Matched to frontend fields
    const orders = edges.map((edge) => {
      const o = edge.node;
      return {
        id: o.id,
        name: o.name,
        createdAt: o.createdAt,
        fulfillmentStatus: o.displayFulfillmentStatus || "Unfulfilled",
        financialStatus: o.displayFinancialStatus || "Pending",
        subtotal: o.subtotalPriceSet?.shopMoney?.amount || "0.00",
        originalTotal: o.totalPriceSet?.shopMoney?.amount || "0.00",
        total: o.currentTotalPriceSet?.shopMoney?.amount || "0.00",
        outstanding: o.totalOutstandingSet?.shopMoney?.amount || "0.00",
        currency: o.currentTotalPriceSet?.shopMoney?.currencyCode || "INR",
        shipping: o.totalShippingPriceSet?.shopMoney?.amount || "0.00",
        tax: o.totalTaxSet?.shopMoney?.amount || "0.00",
        channel: o.publication?.name || o.app?.name || "Online Store",
        tags: o.tags?.join(", ") || "",
        customer: o.customer || {},
        deliveryStatus: o.displayFulfillmentStatus || "Not Delivered",
        deliveryMethod: o.shippingLines?.edges?.[0]?.node?.title || o.shippingLines?.edges?.[0]?.node?.code || "Standard Shipping",
        shippingAddress: o.shippingAddress || {},
        items: o.lineItems?.edges?.map((i) => ({
          title: i.node.title,
          quantity: i.node.quantity,
          price: i.node.discountedTotalSet?.shopMoney?.amount || "0.00",
          originalPrice: i.node.originalTotalSet?.shopMoney?.amount || "0.00",
          currency: i.node.discountedTotalSet?.shopMoney?.currencyCode || "INR",
        })) || [],
      };
    });

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
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