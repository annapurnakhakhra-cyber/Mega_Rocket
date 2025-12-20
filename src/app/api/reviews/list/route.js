// app/api/reviews/list/route.js
import connectDB from "@/lib/db";
import Review from "@/models/Review";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return Response.json(
        { success: false, message: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    return Response.json({
      success: true,
      productId,
      reviews,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
