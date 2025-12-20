import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerId: String,
  items: Array,
  amount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
