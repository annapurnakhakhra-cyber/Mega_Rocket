import connectToDB  from "@/lib/db";
import Setting from "@/models/Setting";

export async function GET() {
  await connectDB();
  return Response.json(await Setting.find());
}
