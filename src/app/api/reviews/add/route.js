// app/api/reviews/add/route.js
import connectDB from "@/lib/db";
import Review from "@/models/Review";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const required = ["productId", "name", "rating", "review"];
    for (const field of required) {
      if (!data[field]) {
        return Response.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newReview = await Review.create(data);

    return Response.json(
      { success: true, message: "Review submitted successfully", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
