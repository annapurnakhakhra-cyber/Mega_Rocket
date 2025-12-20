const STORE = process.env.SHOPIFY_STORE_DOMAIN; 
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN; 

//---------------------------------------------
// GET ALL PRICE RULES (Discount Codes)
//---------------------------------------------
export async function getPriceRules() {
  const res = await fetch(
    `https://${STORE}/admin/api/2024-04/price_rules.json`,
    {
      headers: { "X-Shopify-Access-Token": TOKEN },
    }
  );

  const data = await res.json();
  return data?.price_rules || [];
}

//---------------------------------------------
// GET DISCOUNT CODES FOR A PRICE RULE
//---------------------------------------------
export async function getCodesByRule(ruleId) {
  const res = await fetch(
    `https://${STORE}/admin/api/2024-04/price_rules/${ruleId}/discount_codes.json`,
    {
      headers: { "X-Shopify-Access-Token": TOKEN },
    }
  );

  const data = await res.json();
  return data?.discount_codes || [];
}

//---------------------------------------------
// GET AUTOMATIC DISCOUNTS (GraphQL)
//---------------------------------------------
export async function getAutomaticDiscounts() {
  const query = `
    {
      automaticDiscountNodes(first: 20) {
        edges {
          node {
            id
            automaticDiscount {
              ... on DiscountAutomaticBasic {
                title
                startsAt
                endsAt
                customerGets {
                  value {
                    ... on DiscountPercentage {
                      percentage
                    }
                    ... on DiscountAmount {
                      amount {
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
  `;

  const res = await fetch(
    `https://${STORE}/admin/api/2024-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  const data = await res.json();
  return data?.data?.automaticDiscountNodes?.edges || [];
}

//---------------------------------------------
// GET EVERYTHING: Price Rules + Codes + Automatic Discounts
//---------------------------------------------
export async function getAllDiscounts() {
  const rules = await getPriceRules();

  const ruleWithCodes = await Promise.all(
    rules.map(async (rule) => {
      const codes = await getCodesByRule(rule.id);
      return { ...rule, codes };
    })
  );

  const automatic = await getAutomaticDiscounts();

  return {
    priceRules: ruleWithCodes,
    automaticDiscounts: automatic
  };
}
