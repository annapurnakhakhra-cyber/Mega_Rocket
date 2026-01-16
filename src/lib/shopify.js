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
// export async function getAllProducts(first = 50) {
//   const query = `
//     query getProducts($first: Int!) {
//       products(first: $first) {
//         edges {
//           node {
//             id
//             title
//             handle
//             vendor
//             description
//             featuredImage { 
//               url 
//               altText 
//             }
//             variants(first: 1) {
//               edges {
//                 node {
//                   id
//                   title
//                   price { 
//                     amount 
//                     currencyCode 
//                   }
//                   compareAtPrice: compareAtPriceV2 { 
//                     amount 
//                     currencyCode 
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const data = await request(query, { first });

//   return data.products.edges.map(edge => ({
//     ...edge.node,
//     variantId: edge.node.variants.edges[0]?.node.id || null,
//     price: edge.node.variants.edges[0]?.node.price || null,
//     compareAtPrice: edge.node.variants.edges[0]?.node.compareAtPrice || null,
//   }));
// }


// lib/shopify.js

async function requestShopify(query, variables, accessToken, shopUrl) {
  if (!accessToken || !shopUrl) {
    throw new Error("Missing Shopify accessToken or shopUrl");
  }

  // December 2025 में latest stable version 2025-10 है
  const endpoint = `https://${shopUrl}/admin/api/2025-10/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify API Error ${response.status}: ${text}`);
  }

  const { data, errors } = await response.json();

  if (errors && errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(", "));
  }

  return data;
}

export async function getAllProducts(first = 50, credentials = {}) {
  const { accessToken, shopUrl } = credentials;

  if (!accessToken || !shopUrl) {
    throw new Error("accessToken and shopUrl are required");
  }

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
                  price        # अब सिर्फ string (e.g. "199.00")
                  compareAtPrice  # अब सिर्फ string या null
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { first };

  const data = await requestShopify(query, variables, accessToken, shopUrl);

  return data.products.edges.map(edge => ({
    ...edge.node,
    variantId: edge.node.variants.edges[0]?.node.id || null,
    price: edge.node.variants.edges[0]?.node.price 
      ? { amount: edge.node.variants.edges[0].node.price, currencyCode: "INR" }  // default currency मान लो INR, या store से fetch करो
      : null,
    compareAtPrice: edge.node.variants.edges[0]?.node.compareAtPrice
      ? { amount: edge.node.variants.edges[0].node.compareAtPrice, currencyCode: "INR" }
      : null,
  }));
}