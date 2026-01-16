// src/app/api/c2p-settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import C2PSettings from '@/models/C2PSettings';

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

    const settings = await C2PSettings.findOne({ storeId });
    if (!settings) {
      const defaultModel = new C2PSettings({ storeId });
      return NextResponse.json({ success: true, data: defaultModel.data });
    }

    return NextResponse.json({ success: true, data: settings.data });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch', error: error.message },
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

    // This will now work because storeId is in schema and we're passing it
    const updated = await C2PSettings.findOneAndUpdate(
      { storeId },
      { storeId, data, updatedAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      data: updated.data,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save', error: error.message },
      { status: 500 }
    );
  }
}