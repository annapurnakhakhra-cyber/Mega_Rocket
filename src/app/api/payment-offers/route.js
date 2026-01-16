// app/api/payment-offers/route.js
import connectDB from '@/lib/db';
import PaymentOffer from '@/models/PaymentOffer';
import { NextResponse } from 'next/server';

function getShopId(request) {
  const shopId = request.headers.get('x-shop-id') || request.headers.get('X-Shop-Id');
  if (!shopId) throw new Error('Missing X-Shop-Id header');
  return shopId.trim();
}

export async function GET(request) {
  try {
    await connectDB();
    const shopId = getShopId(request);

    // Optional: filter by status (e.g., ?status=published or ?status=draft)
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const query = { shopId };
    if (statusFilter && ['draft', 'published'].includes(statusFilter)) {
      query.status = statusFilter;
    }

    const offers = await PaymentOffer.find(query)
      .sort({ createdAt: -1 }) // newest first
      .select('-__v'); // exclude version field for cleaner response

    return NextResponse.json(offers);
  } catch (error) {
    console.error('GET /api/payment-offers error:', error);
    if (error.message.includes('Missing')) {
      return NextResponse.json({ error: 'X-Shop-Id header is required' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const shopId = getShopId(request);
    const body = await request.json();

    // Validate required fields
    if (!body.discountCode || !body.offerName || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: discountCode, offerName, startDate, endDate' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      shopId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status || 'draft', // default to draft
    };

    const offer = await PaymentOffer.create(payload);

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('POST /api/payment-offers error:', error);

    if (error.message.includes('Missing X-Shop-Id header')) {
      return NextResponse.json({ error: 'X-Shop-Id header is required' }, { status: 400 });
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate entry detected' }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Failed to create offer', details: error.message },
      { status: 500 }
    );
  }
}