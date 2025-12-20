// app/api/suggested/remove/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SuggestedProduct from '@/models/SuggestedProduct';

export async function DELETE(request) {
  console.log('=== REMOVE SUGGESTED PRODUCT API CALLED ===');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    const { shopifyProductId } = body;

    // Validation
    if (!shopifyProductId) {
      console.log('Validation failed: Missing shopifyProductId');
      return NextResponse.json(
        { 
          success: false, 
          error: 'shopifyProductId is required' 
        },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Find and delete the product
    console.log('Removing product:', shopifyProductId);
    const deletedProduct = await SuggestedProduct.findOneAndDelete({ 
      shopifyProductId 
    });

    if (!deletedProduct) {
      console.log('Product not found in suggested list');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found in suggested list' 
        },
        { status: 404 }
      );
    }

    console.log('Product removed successfully:', deletedProduct._id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Product removed from suggested list',
        product: deletedProduct
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('=== ERROR IN REMOVE SUGGESTED API ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}