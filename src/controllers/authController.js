import connectToDB  from "@/lib/db";
import User from "@/models/User";


export async function registerUser({ adminName, email, shopName, shopUrl, accessToken }) {
  await connectToDB();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { success: false, message: "Email already registered" };
  }

  // Create new user
  const newUser = await User.create({ adminName, email, shopName, shopUrl, accessToken });
  return { success: true, data: newUser };
}
