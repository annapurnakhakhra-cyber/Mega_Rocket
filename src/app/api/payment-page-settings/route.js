// src/app/api/payment-page-settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PaymentPageSettings from '@/models/PaymentPageSettings';

await connectDB();

function getStoreIdFromHeaders(headers) {
  const storeId = headers.get('x-store-id') || headers.get('X-Store-Id');
  return storeId?.trim() || null;
}

export async function GET(request) {
  try {
    const storeId = getStoreIdFromHeaders(request.headers);
    if (!storeId) {
      return NextResponse.json(
        { success: false, message: 'Missing x-store-id header' },
        { status: 400 }
      );
    }

    const settings = await PaymentPageSettings.findOne({ storeId });

    if (!settings) {
      const defaultModel = new PaymentPageSettings({ storeId });
      return NextResponse.json({ success: true, data: defaultModel.data });
    }

    return NextResponse.json({ success: true, data: settings.data });
  } catch (error) {
    console.error('GET payment page settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const storeId = getStoreIdFromHeaders(request.headers);
    if (!storeId) {
      return NextResponse.json(
        { success: false, message: 'Missing x-store-id header' },
        { status: 400 }
      );
    }

    const { data } = await request.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid data in body' },
        { status: 400 }
      );
    }

    const updated = await PaymentPageSettings.findOneAndUpdate(
      { storeId },
      { storeId, data, updatedAt: Date.now() },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Payment page settings saved successfully',
      data: updated.data,
    });
  } catch (error) {
    console.error('PUT payment page settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save settings', error: error.message },
      { status: 500 }
    );
  }
}