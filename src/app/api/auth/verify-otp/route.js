export const dynamic = "force-dynamic";

import connectToDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  await connectToDB(); // <-- fixed

  const { email, otp } = await req.json();

  const record = await Otp.findOne({ email, otp });
  if (!record) return Response.json({ success: false, msg: "Invalid OTP" });

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email });

  const token = signToken({ email });

  // Optionally delete the OTP after verification
  await Otp.deleteOne({ email, otp });

  return Response.json({ success: true, token });
}
