// src/app/api/shopify/recover-cart-by-id/route.js
// TEMPORARY TEST VERSION - Works without DB

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cartId } = await request.json();

    console.log('Received cartId:', cartId); // Check in terminal

    if (!cartId) {
      return NextResponse.json(
        { success: false, error: 'Missing cartId' },
        { status: 400 }
      );
    }

    // FOR TESTING: Fake a Shopify token based on cartId
    // In real app, this comes from your database
    const fakeShopifyToken = "test123abc456def" + cartId.slice(-6);

    const storeDomain = "your-store.myshopify.com"; // Change to your real store

    return NextResponse.json({
      success: true,
      shopifyToken: fakeShopifyToken,
      recoverUrl: `https://${storeDomain}/cart/${fakeShopifyToken}`,
      message: 'Test recovery successful! (This is fake data for testing)',
      receivedCartId: cartId
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}