import connectToDB from "@/lib/db"; // default import
import Otp from "@/models/Otp";
import { sendMail } from "@/lib/sendMail";

export async function POST(req) {
  try {
    await connectToDB();
    
    const { email } = await req.json();
    console.log("🔗 Connected to DB",email) ;
    if (!email) {
      return new Response(JSON.stringify({ success: false, msg: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Otp.create({ email, otp });

    // Send OTP email
    await sendMail(email, "Your OTP", `<h1>Your OTP: ${otp}</h1>`);

    // Return success
    return new Response(JSON.stringify({ success: true, msg: "OTP sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 OTP API Error:", err);
    return new Response(JSON.stringify({ success: false, msg: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
