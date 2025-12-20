// lib/shopify.js

const SHOPIFY_DOMAIN = "hit-megascale.myshopify.com";
const STOREFRONT_TOKEN = "fefa11b2f4ca01406c2454f21d8916ad";

const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2025-10/graphql.json`;

// Storefront request (public)
async function request(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "Storefront error");
  return json.data;
}

// ===========================
// GET ALL PRODUCTS
// ===========================
export async function getAllProducts(first = 50) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            vendor
            description
            featuredImage { 
              url 
              altText 
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price { 
                    amount 
                    currencyCode 
                  }
                  compareAtPrice: compareAtPriceV2 { 
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
  `;

  const data = await request(query, { first });

  return data.products.edges.map(edge => ({
    ...edge.node,
    variantId: edge.node.variants.edges[0]?.node.id || null,
    price: edge.node.variants.edges[0]?.node.price || null,
    compareAtPrice: edge.node.variants.edges[0]?.node.compareAtPrice || null,
  }));
}