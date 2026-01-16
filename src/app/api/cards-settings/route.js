// app/api/cards-settings/route.js

import connectDB from '@/lib/db';
import CardsSettings from '@/models/CardsSettings';
import { NextResponse } from 'next/server';

// Default fallback data
const defaultData = {
  buttonTitle: 'Debit/Credit Cards',
  buttonSubtext: '',
  buttonColor: '#F74435',
  buttonTextColor: '#FFFFFF',
  buttonBadgeText: '',
  buttonBadgeColor: '#03B696',
  buttonBadgeTextColor: '#FFFFFF',
  enableSavedCards: false,
};

function getStoreId(request) {
  const storeId = request.headers.get('x-store-id') || request.headers.get('X-Store-Id');
  if (!storeId) {
    throw new Error('Missing X-Store-Id header');
  }
  return storeId.trim();
}

export async function GET(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);

    const config = await CardsSettings.findOne({ storeId });

    if (!config) {
      return NextResponse.json(defaultData);
    }

    return NextResponse.json(config.data);
  } catch (error) {
    console.error('GET /api/cards-settings error:', error.message);

    if (error.message.includes('Missing X-Store-Id header')) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(defaultData);
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);
    const updates = await request.json();

    // Optional: Validate hex colors if needed (basic check)
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (
      updates.buttonColor && !hexColorRegex.test(updates.buttonColor) ||
      updates.buttonTextColor && !hexColorRegex.test(updates.buttonTextColor) ||
      updates.buttonBadgeColor && !hexColorRegex.test(updates.buttonBadgeColor) ||
      updates.buttonBadgeTextColor && !hexColorRegex.test(updates.buttonBadgeTextColor)
    ) {
      return NextResponse.json(
        { error: 'Invalid hex color format. Use #RRGGBB' },
        { status: 400 }
      );
    }

    // Get current settings
    const current = await CardsSettings.findOne({ storeId });

    // Merge updates with existing data (preserve missing fields)
    const mergedData = {
      buttonTitle: updates.buttonTitle ?? current?.data?.buttonTitle ?? defaultData.buttonTitle,
      buttonSubtext: updates.buttonSubtext ?? current?.data?.buttonSubtext ?? defaultData.buttonSubtext,
      buttonColor: updates.buttonColor ?? current?.data?.buttonColor ?? defaultData.buttonColor,
      buttonTextColor: updates.buttonTextColor ?? current?.data?.buttonTextColor ?? defaultData.buttonTextColor,
      buttonBadgeText: updates.buttonBadgeText ?? current?.data?.buttonBadgeText ?? defaultData.buttonBadgeText,
      buttonBadgeColor: updates.buttonBadgeColor ?? current?.data?.buttonBadgeColor ?? defaultData.buttonBadgeColor,
      buttonBadgeTextColor: updates.buttonBadgeTextColor ?? current?.data?.buttonBadgeTextColor ?? defaultData.buttonBadgeTextColor,
      enableSavedCards: updates.enableSavedCards ?? current?.data?.enableSavedCards ?? defaultData.enableSavedCards,
    };

    const config = await CardsSettings.findOneAndUpdate(
      { storeId },
      {
        storeId,
        data: mergedData,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(config.data);
  } catch (error) {
    console.error('PUT /api/cards-settings error:', error.message);

    if (error.message.includes('Missing X-Store-Id header')) {
      return NextResponse.json(
        { error: 'X-Store-Id header is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save Cards settings' },
      { status: 500 }
    );
  }
}