import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

const allowedOrigins = [
  "http://10.27.4.16:3001",
  "http://10.27.4.16:3000",
  "https://annapurnakhakhra.megascale.co.in",
];

const corsHeaders = (origin) => {
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };
  }
  return {};
};

/* ✅ Preflight */
export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  return new Response(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/* ✅ Actual API */
export async function POST(req) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const { name, email, subject, message, store } = await req.json();

    await Contact.create({
      name,
      email,
      subject,
      message,
      store,
    });

    return NextResponse.json(
      { success: true, message: "Thank you! We received your message." },
      {
        status: 201,
        headers: corsHeaders(origin),
      }
    );
  } catch (error) {
    console.error("Contact error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send" },
      {
        status: 500,
        headers: corsHeaders(origin),
      }
    );
  }
}
