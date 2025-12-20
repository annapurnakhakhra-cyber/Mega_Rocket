// shiprocket/app/api/contact/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://10.27.4.16:3000", // ← Change to your frontend URL
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, subject, message } = await request.json();

    // Save to shiprocket MongoDB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    console.log("New contact:", contact);

    // Optional: Send email notification
    // Uncomment if you want Gmail alert
    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "admin@yourcompany.com",
      replyTo: email,
      subject: `New Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });
    */

    return NextResponse.json(
      { success: true, message: "Thank you! We received your message." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Failed to send" },
      { status: 500, headers: corsHeaders }
    );
  }
}