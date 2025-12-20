import { NextResponse } from "next/server";
// import { saveGokwikCheckout } from "@/controllers/gokwik-checkout";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      email,
      phone,
      name,
      address,
      paymentMethod,
      lineItems,
      subtotal,
      shippingPrice = 50,
      taxAmount = 0,
      total,
      saveWallet = false,
    } = body;
    console.log("GoKwik Checkout Request:", { email, subtotal, paymentMethod });

    if (!email || !phone || !lineItems?.length || !name || !address) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    if (phone.length !== 10 || isNaN(phone)) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 });
    }

    // Recalculate if needed
    const calcTax = Math.round(subtotal * 0.12);
    const calcTotal = subtotal + shippingPrice + calcTax;

    const savedData = await saveGokwikCheckout({
      email,
      phone,
      name,
      address,
      paymentMethod,
      lineItems,
      subtotal,
      shippingPrice,
      taxAmount: calcTax,
      total: calcTotal,
      saveWallet,
      status: "pending",
      createdAt: new Date(),
    });

    const checkoutUrl = paymentMethod === "cod" ? `/orders/confirm?orderId=${savedData.id}` : savedData.paymentUrl;

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      id: savedData.id,
      checkoutUrl,
      recoveryUrl: savedData.recoveryUrl,
      paymentUrl: savedData.paymentUrl,
    }, { status: 201 });
  } catch (err) {
    console.error("GoKwik Route Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}