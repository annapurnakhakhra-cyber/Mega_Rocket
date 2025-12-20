

import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import connectToDB  from "@/lib/db";

export async function POST(req) {
  await connectToDB();

  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const token = signToken({ email: user.email });

  return Response.json({ token }, { status: 200 });
}
  