import connectToDB from "@/lib/db";
import AbandonedCartNote from "@/models/AbandonedCartNote";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);

    const abandonedCartId = searchParams.get("abandonedCartId");
    const email = searchParams.get("email"); // optional

    if (!abandonedCartId) {
      return new Response(
        JSON.stringify({ message: "abandonedCartId is required" }),
        { status: 400 }
      );
    }

    const query = { abandonedCartId };

    if (email) {
      query.email = email.toLowerCase();
    }

    const notes = await AbandonedCartNote.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return new Response(
      JSON.stringify({
        success: true,
        count: notes.length,
        data: notes,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get abandoned cart notes error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
