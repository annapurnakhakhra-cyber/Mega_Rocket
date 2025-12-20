import connectToDB  from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();
  const orders = await Order.find();

  const total = orders.reduce((sum, o) => sum + o.amount, 0);

  return Response.json({ total, count: orders.length });
}
