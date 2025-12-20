import client from '@/lib/shopify-client';
import { gql } from '@apollo/client';

const GET_ABANDONED_CHECKOUTS = gql`
  query GetAbandonedCheckouts($first: Int, $query: String) {
    abandonedCheckouts(first: $first, query: $query) {
      edges {
        node {
          id
          createdAt
          updatedAt
          abandonedCheckoutUrl

          customer {
            email
            firstName
            lastName
          }

          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }

          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  title
                }
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                originalTotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedTotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 20;

    const { data } = await client.query({
      query: GET_ABANDONED_CHECKOUTS,
      variables: {
        first: limit,
        query: 'status:open',
      },
      fetchPolicy: 'network-only',
    });

    if (!data?.abandonedCheckouts?.edges) {
      return Response.json({ success: true, data: [], count: 0, message: 'No abandoned checkouts' });
    }

    const formatted = data.abandonedCheckouts.edges.map(edge => {
      const node = edge.node;
      const total = node.totalPriceSet?.shopMoney?.amount ?? '0';
      const currency = node.totalPriceSet?.shopMoney?.currencyCode ?? 'USD';

      const createdAt = new Date(node.createdAt).toLocaleString('en-IN', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      const customerName = node.customer
        ? `${node.customer.firstName || ''} ${node.customer.lastName || ''}`.trim()
        : 'Guest';

      return {
        id: node.id,
        email: node.customer?.email || 'No email',
        customerName: customerName || 'Customer',
        recoveryUrl: node.abandonedCheckoutUrl,
        createdAt,
        timestamp: node.createdAt,
        totalValue: `${currency} ${parseFloat(total).toFixed(2)}`,
        totalNumeric: parseFloat(total),
        currency,
        items: node.lineItems.edges.map(li => {
          const item = li.node;
          const unitPrice = item.originalUnitPriceSet.shopMoney.amount;
          const unitCurrency = item.originalUnitPriceSet.shopMoney.currencyCode;

          return {
            id: item.id,
            title: item.title,
            variant: item.variant?.title || '',
            quantity: item.quantity,
            unitPrice: `${unitCurrency} ${parseFloat(unitPrice).toFixed(2)}`,
            totalPrice: `${unitCurrency} ${ (parseFloat(unitPrice) * item.quantity).toFixed(2) }`,
            image: item.image?.url || null,
            altText: item.image?.altText || item.title,
          };
        }),
      };
    });

    return Response.json({ success: true, data: formatted, count: formatted.length, fetchedAt: new Date().toISOString() });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
