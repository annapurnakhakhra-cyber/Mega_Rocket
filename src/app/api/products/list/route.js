// app/api/products/list/route.js (Next.js App Router)

import { getAllProducts } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get limit from URL params (default 100)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    
    // Fetch products from Shopify
    const products = await getAllProducts(limit);

    return NextResponse.json({ 
      success: true, 
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products',
        message: error.message 
      },
      { status: 500 }
    );
  }
}