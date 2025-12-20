// app/api/suggested/add/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SuggestedProduct from '@/models/SuggestedProduct';

export async function POST(request) {
  console.log('=== ADD SUGGESTED PRODUCT API CALLED ===');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    const {
      shopifyProductId,
      productHandle,
      title,
      vendor,
      price,
      compareAtPrice,
      featuredImageUrl,
      variantId,
    } = body;

    // Validation
    if (!shopifyProductId || !productHandle || !title) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: shopifyProductId, productHandle, title' 
        },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Check if already exists
    console.log('Checking if product already exists...');
    const existing = await SuggestedProduct.findOne({ shopifyProductId });
    
    if (existing) {
      console.log('Product already exists:', existing._id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product already in suggested list' 
        },
        { status: 400 }
      );
    }

    // Get the highest display order and add 1
    console.log('Getting display order...');
    const lastProduct = await SuggestedProduct.findOne().sort({ displayOrder: -1 });
    const displayOrder = lastProduct ? lastProduct.displayOrder + 1 : 0;
    console.log('Display order:', displayOrder);

    // Create new suggested product
    console.log('Creating suggested product...');
    const suggestedProduct = await SuggestedProduct.create({
      shopifyProductId,
      productHandle,
      title,
      vendor: vendor || '',
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      featuredImageUrl: featuredImageUrl || '',
      variantId: variantId || '',
      isActive: true,
      displayOrder,
    });

    console.log('Product added successfully:', suggestedProduct._id);

    return NextResponse.json(
      { 
        success: true, 
        product: suggestedProduct,
        message: 'Product added to suggested list'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('=== ERROR IN ADD SUGGESTED API ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}