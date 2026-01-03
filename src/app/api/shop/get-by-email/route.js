import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const shop = await prisma.shop.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: 'insensitive',
        },
      },
      select: {
        myshopify_domain: true,
      },
    });

    if (!shop || !shop.myshopify_domain) {
      return NextResponse.json({ error: "No store found for this email" }, { status: 404 });
    }

    return NextResponse.json({
      myshopify_domain: shop.myshopify_domain,
    });
  } catch (error) {
    console.error("Error fetching shop by email:", error);
    return NextResponse.json({ error: "Server error while fetching store" }, { status: 500 });
  }
}