  // app/api/payment-config/route.js
  import connectDB from '@/lib/mongodb';
  import PaymentConfig from '@/models/PaymentConfig';
  import { NextResponse } from 'next/server';

  // Default fallback data
  const defaultData = {
    features: {
      onplEnabled: false,
      c2pEnabled: false,
      recommendedEnabled: false,
    },
    methodUiStyle: 'default',
    paymentMethods: {
      cod: { enabled: true },
      upi: { enabled: true },
      cards: { enabled: true },
      wallets: { enabled: true },
      netbanking: { enabled: true },
      native: { enabled: false },
    },
  };

  function getShopId(request) {
    const shopId = request.headers.get('x-shop-id') || request.headers.get('X-Shop-Id');

    if (!shopId) {
      throw new Error('Missing X-Shop-Id header');
    }

    return shopId.trim();
  }

  export async function GET(request) {
    try {
      await connectDB();
      const shopId = getShopId(request);

      const config = await PaymentConfig.findOne({ shopId });

      if (!config) {
        return NextResponse.json(defaultData);
      }

      return NextResponse.json(config.data);
    } catch (error) {
      console.error('GET /api/payment-config error:', error.message);

      
      if (error.message.includes('Missing X-Shop-Id header')) {
        return NextResponse.json(
          { error: 'X-Shop-Id header is required' },
          { status: 400 }
        );
      }

      return NextResponse.json(defaultData); 
    }
  }

  export async function PUT(request) {
    try {
      await connectDB();
      const shopId = getShopId(request);
      const updatedData = await request.json();

      const config = await PaymentConfig.findOneAndUpdate(
        { shopId },
        {
          shopId,
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
      console.error('PUT /api/payment-config error:', error.message);

      if (error.message.includes('Missing X-Shop-Id header')) {
        return NextResponse.json(
          { error: 'X-Shop-Id header is required' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to save configuration' },
        { status: 500 }
      );
    }
  }