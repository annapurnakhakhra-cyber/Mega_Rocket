// shiprocket/src/app/api/user-data/route.js

import { NextResponse } from "next/server";

// 🔴 Replace with your Shopify credentials
const SHOPIFY_STORE_URL = "hit-megascale.myshopify.com"; // e.g., mystore.myshopify.com
const SHOPIFY_ADMIN_API_VERSION = "2023-10";
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

export async function POST(request) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { message: "Customer ID is required." },
        { status: 400 }
      );
    }

    console.log(`Fetching Shopify customer with ID: ${customerId}`);

    // Fetch customer from Shopify Admin API
    const response = await fetch(
      `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/customers/${customerId}.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Shopify API error:", errText);
      return NextResponse.json(
        { message: `Failed to fetch customer: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const customer = data.customer;

    if (!customer) {
      return NextResponse.json({ message: "Customer not found." }, { status: 404 });
    }

    // Format the response for your frontend
    const userData = {
      customerId: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      address_found: customer.default_address ? true : false,
      address: {
        country: customer.default_address?.country_code || "IN",
        first_name: customer.first_name,
        last_name: customer.last_name,
        line1: customer.default_address?.address1 || "",
        address2: customer.default_address?.address2 || "",
        pincode: customer.default_address?.zip || "",
        city: customer.default_address?.city || "",
        state: customer.default_address?.province || "",
        saveInfo: true,
      },
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching customer from Shopify:", error);
    return NextResponse.json(
      { message: "Internal server error.", detailedError: error.message },
      { status: 500 }
    );
  }
}
