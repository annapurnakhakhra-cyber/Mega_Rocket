// src/app/api/native-payment-settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // assuming same DB utility as C2P
import NativePaymentSettings from '@/models/NativePaymentSettings';

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

    const settings = await NativePaymentSettings.findOne({ storeId });

    if (!settings) {
      // Return default values when no document exists
      const defaultModel = new NativePaymentSettings({ storeId });
      return NextResponse.json({ success: true, data: defaultModel.data });
    }

    return NextResponse.json({ success: true, data: settings.data });
  } catch (error) {
    console.error('GET native payment settings error:', error);
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

    const updated = await NativePaymentSettings.findOneAndUpdate(
      { storeId },
      { storeId, data, updatedAt: Date.now() },
      {
        upsert: true,             // Create if doesn't exist
        new: true,                // Return updated document
        setDefaultsOnInsert: true // Apply default values on insert
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Native payment settings saved successfully',
      data: updated.data,
    });
  } catch (error) {
    console.error('PUT native payment settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save settings', error: error.message },
      { status: 500 }
    );
  }
}