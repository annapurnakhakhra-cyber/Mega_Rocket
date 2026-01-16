// app/api/payment-offers/[id]/route.js
import connectDB from '@/lib/db';
import PaymentOffer from '@/models/PaymentOffer';
import { NextResponse } from 'next/server';

function getShopId(request) {
  const shopId = request.headers.get('x-shop-id') || request.headers.get('X-Shop-Id');
  if (!shopId) {
    throw new Error('Missing X-Shop-Id header');
  }
  return shopId.trim();
}

// GET - Fetch single offer
export async function GET(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const shopId = getShopId(request);

    const offer = await PaymentOffer.findOne({ _id: id, shopId });

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
  }
}

// PUT - Update offer
export async function PUT(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const shopId = getShopId(request);
    const body = await request.json();

    console.log('PUT Request - ID:', id, 'ShopId:', shopId);

    const updatePayload = {
      ...body,
      ...(body.startDate && { startDate: new Date(body.startDate) }),
      ...(body.endDate && { endDate: new Date(body.endDate) }),
    };

    if (body.status === 'published') {
      updatePayload.status = 'published';
    }

    const updatedOffer = await PaymentOffer.findOneAndUpdate(
      { _id: id, shopId },
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return NextResponse.json(
        { error: 'Offer not found. Check _id and shopId match exactly.' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error('PUT error:', error);

    if (error.message.includes('Missing X-Shop-Id header')) {
      return NextResponse.json(
        { error: 'X-Shop-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update offer', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a payment offer
export async function DELETE(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    const shopId = getShopId(request);

    console.log('DELETE Request - ID:', id, 'ShopId:', shopId);

    const deletedOffer = await PaymentOffer.findOneAndDelete({
      _id: id,
      shopId,
    });

    if (!deletedOffer) {
      return NextResponse.json(
        { error: 'Offer not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Payment offer deleted successfully',
      deletedOffer,
    });
  } catch (error) {
    console.error('DELETE error:', error);

    if (error.message.includes('Missing X-Shop-Id header')) {
      return NextResponse.json(
        { error: 'X-Shop-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete offer', details: error.message },
      { status: 500 }
    );
  }
}