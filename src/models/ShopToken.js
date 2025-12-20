import mongoose from "mongoose";

const ShopTokenSchema = new mongoose.Schema(
  {
    shopDomain: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    shopName: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true }
);

// ❌ No middleware, no hooks, no next()

export default mongoose.models.ShopToken ||
  mongoose.model("ShopToken", ShopTokenSchema);
