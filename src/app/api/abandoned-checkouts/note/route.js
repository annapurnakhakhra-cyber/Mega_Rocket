import connectToDB from "@/lib/db";
import AbandonedCartNote from "@/models/AbandonedCartNote";

export async function POST(req) {
  try {
    await connectToDB();

    const { abandonedCartId, email, note } = await req.json();

    if (!abandonedCartId || !email || !note) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const savedNote = await AbandonedCartNote.create({
      abandonedCartId,
      email,
      note,
    });

    return new Response(
      JSON.stringify({
        message: "Note saved successfully",
        data: savedNote,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Save abandoned cart note error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
