// app/api/onpl-settings/route.js

import connectDB from '@/lib/mongodb';
import OnplSettings from '@/models/OnplSettings';
import { NextResponse } from 'next/server';

// Default data
const defaultData = {
  pendingTimer: 10,
  failedTimer: 10,
  waiveCodCharges: false,
  enableCodTimer: true,
};

function getStoreId(request) {
  const storeId = request.headers.get('x-store-id') || request.headers.get('X-Store-Id');
  if (!storeId) {
    throw new Error('Missing X-Store-Id header');
  }
  return storeId.trim();
}

// GET: Fetch settings (returns saved or defaults)
export async function GET(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);

    const config = await OnplSettings.findOne({ storeId });

    if (!config) {
      return NextResponse.json(defaultData);
    }

    return NextResponse.json(config.data);
  } catch (error) {
    console.error('GET /api/onpl-settings error:', error.message);

    if (error.message.includes('Missing X-Store-Id header')) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(defaultData);
  }
}

// POST: Create new ONPL settings (explicit create – fails if already exists)
export async function POST(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);
    const body = await request.json();

    // Check if already exists
    const existing = await OnplSettings.findOne({ storeId });
    if (existing) {
      return NextResponse.json(
        { error: 'ONPL settings already exist for this store. Use PUT to update.' },
        { status: 409 } // Conflict
      );
    }

    // Optional validation
    if (
      body.pendingTimer !== undefined && body.pendingTimer < 1 ||
      body.failedTimer !== undefined && body.failedTimer < 1
    ) {
      return NextResponse.json(
        { error: 'Timer values must be at least 1 minute' },
        { status: 400 }
      );
    }

    const newConfig = new OnplSettings({
      storeId,
      data: {
        pendingTimer: body.pendingTimer ?? 10,
        failedTimer: body.failedTimer ?? 10,
        waiveCodCharges: body.waiveCodCharges ?? false,
        enableCodTimer: body.enableCodTimer ?? true,
        ...body, // Allow extra fields if needed
      },
    });

    await newConfig.save();

    return NextResponse.json(newConfig.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/onpl-settings error:', error.message);

    if (error.message.includes('Missing X-Store-Id header')) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create ONPL settings' },
      { status: 500 }
    );
  }
}

// PUT: Update or Create (upsert – your original behavior)
export async function PUT(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);
    const updatedData = await request.json();

    if (
      updatedData.pendingTimer !== undefined && updatedData.pendingTimer < 1 ||
      updatedData.failedTimer !== undefined && updatedData.failedTimer < 1
    ) {
      return NextResponse.json(
        { error: 'Timer values must be at least 1 minute' },
        { status: 400 }
      );
    }

    const config = await OnplSettings.findOneAndUpdate(
      { storeId },
      {
        storeId,
        data: updatedData,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(config.data);
  } catch (error) {
    console.error('PUT /api/onpl-settings error:', error.message);

    if (error.message.includes('Missing X-Store-Id header')) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save ONPL settings' },
      { status: 500 }
    );
  }
}