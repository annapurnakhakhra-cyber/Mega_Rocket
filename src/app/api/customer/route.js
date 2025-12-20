export const dynamic = "force-dynamic";

import connectToDB  from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

const CUSTOMER_BATCH_SIZE = 50; // customers per request
const ORDER_BATCH_SIZE = 50;    // orders per request

export async function GET(req) {
  await connectToDB();

  // 1️⃣ Auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  // 2️⃣ Get admin
  const admin = await User.findOne({ email: decoded.email }).select("+accessToken +shopUrl");
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  if (!admin.accessToken || !admin.shopUrl)
    return NextResponse.json({ error: "Shopify credentials missing" }, { status: 400 });

  const allCustomers = [];
  let customerCursor = null;

  try {
    // 3️⃣ Paginate through all customers
    while (true) {
      const customersQuery = {
        query: `
          {
            customers(first: ${CUSTOMER_BATCH_SIZE}${customerCursor ? `, after: "${customerCursor}"` : ""}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  email
                  firstName
                  lastName
                  orders(first: ${ORDER_BATCH_SIZE}) {
                    edges {
                      node {
                        currentTotalPriceSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
              }
            }
          }
        `
      };

      const resp = await fetch(`https://${admin.shopUrl}/admin/api/2025-10/graphql.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": admin.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customersQuery),
      });

      const data = await resp.json();

      if (data.errors) {
        return NextResponse.json({ error: "Shopify GraphQL returned errors", details: data.errors }, { status: 500 });
      }

      const customersBatch = data.data.customers.edges.map(edge => edge.node);

      // 4️⃣ Process each customer
      const processedCustomers = await Promise.all(
        customersBatch.map(async (c) => {
          let ordersCount = c.orders.edges.length;
          let totalSpent = c.orders.edges.reduce(
            (sum, o) => sum + parseFloat(o.node.currentTotalPriceSet.presentmentMoney.amount),
            0
          );
          let currency = c.orders.edges[0]?.node.currentTotalPriceSet.presentmentMoney.currencyCode || "";

          // Handle pagination for orders if more than ORDER_BATCH_SIZE
          let orderCursor = c.orders.pageInfo.endCursor;
          while (c.orders.pageInfo.hasNextPage && orderCursor) {
            const ordersQuery = {
              query: `
                {
                  customer(id: "${c.id}") {
                    orders(first: ${ORDER_BATCH_SIZE}, after: "${orderCursor}") {
                      edges {
                        node {
                          currentTotalPriceSet {
                            presentmentMoney {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                    }
                  }
                }
              `
            };

            const ordersResp = await fetch(`https://${admin.shopUrl}/admin/api/2025-10/graphql.json`, {
              method: "POST",
              headers: {
                "X-Shopify-Access-Token": admin.accessToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(ordersQuery),
            });

            const ordersData = await ordersResp.json();
            const orderEdges = ordersData.data.customer.orders.edges;

            ordersCount += orderEdges.length;
            totalSpent += orderEdges.reduce(
              (sum, o) => sum + parseFloat(o.node.currentTotalPriceSet.presentmentMoney.amount),
              0
            );

            orderCursor = ordersData.data.customer.orders.pageInfo.endCursor;
            if (!ordersData.data.customer.orders.pageInfo.hasNextPage) break;
          }

          return {
            id: c.id,
            email: c.email,
            firstName: c.firstName || "",
            lastName: c.lastName || "",
            ordersCount,
            totalSpent,
            currency,
          };
        })
      );

      allCustomers.push(...processedCustomers);

      if (!data.data.customers.pageInfo.hasNextPage) break;
      customerCursor = data.data.customers.pageInfo.endCursor;
    }

    return NextResponse.json({ customers: allCustomers });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch Shopify customers", details: err.message }, { status: 500 });
  }
}
