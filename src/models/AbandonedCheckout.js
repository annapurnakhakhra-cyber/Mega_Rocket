// models/AbandonedCheckout.js
import mongoose from "mongoose";

const AbandonedCheckoutSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      immutable: true, // Cannot be changed after creation
    },

    shopurl: {
      type: String,
      required: true,
      immutable: true, // Cannot be changed after creation
    },

    status: {
      type: String,
      enum: ["started", "completed", "abandoned"],
      default: "started",
    },

    customer: Object,
    cart: Object,
    address: Object,
    pricing: Object,
    meta: Object,

    events: [
      {
        event: { type: String, required: true },
        at: { type: Date, default: Date.now },
      },
    ],

    lastEventAt: { type: Date },
  },
  { timestamps: true }
);

// Compound unique index: one document per (sessionId + shopurl)
AbandonedCheckoutSchema.index({ sessionId: 1, shopurl: 1 }, { unique: true });

// Optional: Add a non-unique index on lastEventAt for abandonment queries
AbandonedCheckoutSchema.index({ lastEventAt: 1 });

// Prevent OverwriteModelError in Next.js dev mode (hot reloading)
const AbandonedCheckout =
  mongoose.models.AbandonedCheckout ||
  mongoose.model("AbandonedCheckout", AbandonedCheckoutSchema);

export default AbandonedCheckout;