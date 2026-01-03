// app/api/checkout-tracker/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AbandonedCheckout from "@/models/AbandonedCheckout";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      event,
      sessionId,
      shopurl,
      customer,
      cart,
      address,
      pricing,
      meta,
    } = body;

    // Basic required fields check
    if (!sessionId || !event || !shopurl) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId, event, or shopurl" },
        { status: 400 }
      );
    }

    const filter = { sessionId, shopurl };

    const baseUpdate = {
      ...(customer && { customer }),
      ...(cart && { cart }),
      ...(address && { address }),
      ...(pricing && { pricing }),
      ...(meta && { meta }),
      lastEventAt: new Date(),
      $push: { events: { event, at: new Date() } },
    };

    // Special case: checkout completed
    if (event === "checkout_completed") {
      await AbandonedCheckout.findOneAndUpdate(
        filter,
        {
          ...baseUpdate,
          status: "completed",
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ success: true, completed: true });
    }

    // Special case: checkout_calculated — extract and normalize shipping & tax
    if (event === "checkout_calculated" && pricing) {
      const normalizedShippingLine = pricing.shipping
        ? {
            title: pricing.shipping.title || "Standard Shipping",
            price: parseFloat(pricing.shipping.price?.amount || pricing.shipping.price || 0),
          }
        : null;

      const normalizedTotalTax = pricing.tax?.shopMoney?.amount
        ? parseFloat(pricing.tax.shopMoney.amount)
        : pricing.tax?.amount
        ? parseFloat(pricing.tax.amount)
        : 0;

      const calculatedUpdate = {
        ...baseUpdate,
        shippingLine: normalizedShippingLine,
        totalTax: normalizedTotalTax,
        status: "calculated", // optional: mark that we have real pricing
      };

      await AbandonedCheckout.findOneAndUpdate(
        filter,
        calculatedUpdate,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      return NextResponse.json({ success: true, calculated: true });
    }

    // Normal flow: checkout_started or any other event
    await AbandonedCheckout.findOneAndUpdate(
      filter,
      {
        $setOnInsert: { status: "started" },
        ...baseUpdate,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Checkout tracker error:", err);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const path = Object.keys(err.errors)[0];
      const message = err.errors[path]?.message || "Validation failed";
      return NextResponse.json(
        { success: false, error: { path, message } },
        { status: 400 }
      );
    }

    // Handle duplicate key (shouldn't happen with sessionId + shopurl unique index)
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate session for this shop" },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}