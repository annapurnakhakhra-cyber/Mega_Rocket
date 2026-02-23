export const dynamic = "force-dynamic";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectToDB();

        // 1️⃣ Auth
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        // 2️⃣ Get admin credentials
        const admin = await User.findOne({ email: decoded.email }).select("+accessToken +shopUrl");
        if (!admin || !admin.accessToken || !admin.shopUrl) {
            return NextResponse.json({ error: "Shopify credentials missing" }, { status: 400 });
        }

        // 3️⃣ Fetch Customers with wishlist metafield
        const customersQuery = {
            query: `
        {
          customers(first: 250) {
            edges {
              node {
                id
                email
                firstName
                lastName
                phone
                createdAt
                metafields(first: 10) {
                  edges {
                    node {
                      namespace
                      key
                      value
                    }
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
            console.error("💥 Shopify GraphQL Errors:", JSON.stringify(data.errors, null, 2));
            return NextResponse.json({ error: "Shopify Error", details: data.errors }, { status: 500 });
        }

        const customers = data.data.customers.edges.map(edge => edge.node);

        // 4️⃣ Collect all unique product IDs from wishlists
        const allProductIds = new Set();
        customers.forEach(c => {
            const wishlistMeta = c.metafields?.edges.find(e => e.node.key.toLowerCase().includes('wishlist'))?.node;
            if (wishlistMeta) {
                let ids = [];
                try {
                    // Try parsing as JSON array first (as seen in user response)
                    const parsed = JSON.parse(wishlistMeta.value);
                    ids = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    // Fallback to comma separated
                    ids = wishlistMeta.value.split(',').map(id => id.trim());
                }

                const validIds = ids.filter(id => id && id.startsWith('gid://shopify/Product/'));
                c.wishlistValue = validIds; // Store array of IDs for consolidation
                validIds.forEach(id => allProductIds.add(id));
            }
        });

        // 5️⃣ Fetch product details for all unique IDs
        let productsMap = {};
        if (allProductIds.size > 0) {
            const productsQuery = {
                query: `
          query getProducts($ids: [ID!]!) {
            nodes(ids: $ids) {
              ... on Product {
                id
                title
                handle
                featuredImage {
                  url
                }
                variants(first: 1) {
                  edges {
                    node {
                      price
                    }
                  }
                }
              }
            }
          }
        `,
                variables: { ids: Array.from(allProductIds) }
            };

            const pResp = await fetch(`https://${admin.shopUrl}/admin/api/2025-10/graphql.json`, {
                method: "POST",
                headers: {
                    "X-Shopify-Access-Token": admin.accessToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productsQuery),
            });

            const pData = await pResp.json();
            if (pData.data?.nodes) {
                pData.data.nodes.filter(n => n).forEach(p => {
                    productsMap[p.id] = p;
                });
            }
        }

        // 6️⃣ Consolidate data
        const result = customers.map(c => {
            const wishlistIds = c.wishlistValue || [];
            const wishlistProducts = wishlistIds
                .map(id => productsMap[id])
                .filter(p => p);

            return {
                id: c.id,
                email: c.email,
                firstName: c.firstName || "",
                lastName: c.lastName || "",
                phone: c.phone || "",
                createdAt: c.createdAt,
                wishlist: wishlistProducts
            };
        }).filter(c => c.wishlist.length > 0);

        return NextResponse.json({ customers: result });
    } catch (err) {
        console.error("Wishlist API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
