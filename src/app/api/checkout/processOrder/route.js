import { NextResponse } from 'next/server';

let mockOrders = [];

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.cartItems || !Array.isArray(data.cartItems)) {
      return NextResponse.json({ message: 'Invalid order data: cartItems missing or invalid.' }, { status: 400 });
    }

    // If a BASE_URL is provided in env, forward the order to that service.
    const BASE = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';

    if (BASE) {
      try {
        const forwardRes = await fetch(`${BASE.replace(/\/$/, '')}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const payload = await forwardRes.json().catch(() => null);
        return NextResponse.json(payload || { success: forwardRes.ok }, { status: forwardRes.status });
      } catch (err) {
        console.error('Error forwarding order to BASE_URL:', err);
        // fall through to mock behavior
      }
    }

    // Fallback/mock behavior when no BASE_URL configured or forwarding failed
    const orderId = mockOrders.length + 1;

    const newOrder = {
      orderId,
      cartItems: data.cartItems,
      shippingInfo: data.shippingInfo || {},
      paymentMethod: data.paymentMethod || 'COD',
      totalAmount: data.totalAmount || 0,
      createdAt: new Date().toISOString(),
    };

    mockOrders.push(newOrder);

    return NextResponse.json({ success: true, message: 'Order processed successfully (mock).', orderId, order: newOrder });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ message: 'Failed to process order. Please try again.' }, { status: 500 });
  }
}
