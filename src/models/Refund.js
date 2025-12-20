import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema({
  orderId: String,
  reason: String,
  amount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Refund || mongoose.model("Refund", RefundSchema);
