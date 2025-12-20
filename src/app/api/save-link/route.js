import connectToDB  from "@/lib/db";
// import Link from "@/models/Link";

export async function POST(req) {
  await connectToDB();
  const data = await req.json();
  return Response.json(await Link.create(data));
}
