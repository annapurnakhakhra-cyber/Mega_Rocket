// shiprocket/src/app/api/place-order/route.js

import { NextResponse } from 'next/server';

const SHOPIFY_STORE_URL = "hit-megascale.myshopify.com"; 
const SHOPIFY_API_VERSION = "2023-10"; 
const SHOPIFY_API_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN; 



export async function POST(request) {
    try {
        const orderData = await request.json();
        const address = orderData.shippingAddress;
        const summary = orderData.paymentSummary; 
        const items = orderData.orderItems; 
        const userMobile = orderData.userId; 
        
        // --- 1. Create Shopify Payload ---

        const shopifyLineItems = items.map(item => ({
            variant_id: item.variant_id, 
            quantity: item.quantity,
            title: item.name || "Custom Checkout Product", 
            name: item.name || "Custom Checkout Product",  
            price: (item.base_price - (summary.discount / items.length)).toFixed(2) // Distribute discount to price
        }));

        if (!shopifyLineItems.length || !shopifyLineItems[0].variant_id) {
             throw new Error("Line Items are missing or Variant ID is invalid.");
        }

        const customerDetails = {
            email: `user_${userMobile}@fastcheckout.demo`, 
            first_name: address.first_name || "Guest",
            last_name: address.last_name || "Customer",
        };
        
        const shopifyPayload = {
            order: {
                customer: customerDetails,
                line_items: shopifyLineItems,
                
                shipping_address: {
                    first_name: address.first_name,
                    last_name: address.last_name,
                    address1: address.line1,
                    address2: address.address2 || "",
                    city: address.city,
                    province: address.state,
                    zip: address.pincode,
                    country_code: address.country,
                    phone: `+91${userMobile}`, 
                },

                // Financials
                financial_status: summary.isCodSelected ? "pending" : "paid",
                total_price: summary.totalPayable,
                currency: "INR", 
                
                tags: summary.isCodSelected ? "COD, Custom Checkout" : "PREPAID, Custom Checkout",
                note: `Total Payable: ${summary.totalPayable.toFixed(2)} | Discount Applied: ${summary.discount.toFixed(2)}` 
            }
        };

        // --- 2. Real Shopify API Call ---
        
        const shopifyUrl = `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/orders.json`;
        
        const shopifyResponse = await fetch(shopifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_API_TOKEN
            },
            body: JSON.stringify(shopifyPayload)
        });

        if (!shopifyResponse.ok) {
            const errorDetails = await shopifyResponse.json();
            throw new Error(`Shopify Order Creation Failed. Status: ${shopifyResponse.status}. Details: ${JSON.stringify(errorDetails)}`);
        }

        const shopifyOrder = await shopifyResponse.json();
        const shopifyOrderId = shopifyOrder.order.id;
        
        // --- 3. Custom Backend / MongoDB Save ---
        // (Simplified for this example)
        
        const savedObject = {
            orderId: "SR" + Date.now(), 
            shopifyId: shopifyOrderId, 
            userMobile: userMobile,
            address: address,
            summary: summary,
        };
        
        return NextResponse.json({ 
            message: "Order placed successfully in both systems.", 
            orderId: savedObject.orderId,
            shopifyId: shopifyOrderId
        }, { status: 200 });

    } catch (error) {
        console.error("🚨 CRITICAL ORDER PLACEMENT ERROR:", error.message);
        
        return NextResponse.json({ 
            message: `Order placement failed. Check server logs for details.`, 
            detailedError: error.message
        }, { status: 500 });
    }
}