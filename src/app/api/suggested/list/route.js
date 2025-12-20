// app/api/suggested/list/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SuggestedProduct from '@/models/SuggestedProduct';

export async function GET(request) {
  console.log('=== LIST SUGGESTED PRODUCTS API CALLED ===');
  
  try {
    // Get query params
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') || 'true';
    console.log('Query params - activeOnly:', activeOnly);
    
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Build query
    const query = activeOnly === 'true' ? { isActive: true } : {};
    console.log('Query:', query);

    // Fetch suggested products
    console.log('Fetching suggested products from database...');
    const suggestedProducts = await SuggestedProduct.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    console.log(`✅ Found ${suggestedProducts.length} suggested products`);

    // Return with CORS headers
    return NextResponse.json(
      {
        success: true,
        products: suggestedProducts,
        count: suggestedProducts.length
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );

  } catch (error) {
    console.error('=== ERROR IN LIST SUGGESTED API ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message,
        products: [],
        count: 0
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// Handle OPTIONS preflight request
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}