// app/api/cod-settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CodConfiguration from '@/models/CodConfiguration';

// Helper to connect DB
async function ensureDB() {
  await connectDB();
}

// Extract storeId from header (case-insensitive)
function getStoreIdFromHeader(request) {
  return request.headers.get('x-store-id') || request.headers.get('X-Store-Id');
}

// Default configuration (used when no record exists)
const defaultConfig = {
  codButtonTitle: 'Cash on Delivery',
  codButtonSubtext: '',
  codButtonColor: '#F74435',
  codButtonTextColor: '#FFFFFF',
  codBadgeText: '',
  codBadgeColor: '#F73536',
  codBadgeTextColor: '#FFFFFF',
  minCodOrderValue: 0,
  maxCodOrderValue: 1500,
  codOtpRequirement: false,
  enablePpcod: false,
  ppcodButtonTitle: 'Cash on Delivery',
  ppcodButtonSubtext: 'Amount Non-Refundable',
  ppcodButtonColor: '#F74435',
  ppcodButtonTextColor: '#FFFFFF',
  ppcodBadgeText: '',
  ppcodBadgeColor: '#03B696',
  ppcodBadgeTextColor: '#FFFFFF',
  fixedPpcodAmount: 0,
  tagBasedPpcodActivation: false,
  ppcodDeductionType: 'Fixed',
};

// GET: Fetch settings
export async function GET(request) {
  try {
    await ensureDB();
    const storeId = getStoreIdFromHeader(request);

    if (!storeId) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    const config = await CodConfiguration.findOne({ storeId });
    if (!config) {
      return NextResponse.json({ ...defaultConfig, storeId });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('GET /api/cod-settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch COD settings' },
      { status: 500 }
    );
  }
}

// PUT: Update existing COD settings (idempotent, full or partial update)
export async function PUT(request) {
  try {
    await ensureDB();

    const storeId = getStoreIdFromHeader(request);

    if (!storeId) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Optional: You can require at least one field to update
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Request body is required for update' },
        { status: 400 }
      );
    }

    const allowedFields = [
      'codButtonTitle', 'codButtonSubtext', 'codButtonColor', 'codButtonTextColor',
      'codBadgeText', 'codBadgeColor', 'codBadgeTextColor',
      'minCodOrderValue', 'maxCodOrderValue', 'codOtpRequirement',
      'enablePpcod', 'ppcodButtonTitle', 'ppcodButtonSubtext',
      'ppcodButtonColor', 'ppcodButtonTextColor', 'ppcodBadgeText',
      'ppcodBadgeColor', 'ppcodBadgeTextColor', 'fixedPpcodAmount',
      'tagBasedPpcodActivation', 'ppcodDeductionType'
    ];

    const updateData = {};

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Convert numeric fields
    if (updateData.minCodOrderValue !== undefined) updateData.minCodOrderValue = Number(updateData.minCodOrderValue);
    if (updateData.maxCodOrderValue !== undefined) updateData.maxCodOrderValue = Number(updateData.maxCodOrderValue);
    if (updateData.fixedPpcodAmount !== undefined) updateData.fixedPpcodAmount = Number(updateData.fixedPpcodAmount);

    // Only update if document exists; otherwise return 404 (or you can upsert)
    const existingConfig = await CodConfiguration.findOne({ storeId });

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'COD settings not found for this store. Use POST to create.' },
        { status: 404 }
      );
    }

    const updatedConfig = await CodConfiguration.findOneAndUpdate(
      { storeId },
      updateData,
      { new: true } // Return updated document
    );

    return NextResponse.json({
      success: true,
      message: 'COD settings updated successfully',
      data: updatedConfig,
    });
  } catch (error) {
    console.error('PUT /api/cod-settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update COD settings' },
      { status: 500 }
    );
  }
}

// Optional: Keep POST if you want it for "create only" behavior
// Or remove it if you prefer PUT for both create & update (with upsert)