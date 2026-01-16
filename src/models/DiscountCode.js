// models/DiscountCode.js
import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["manual", "automatic", "bulk"],
      required: true,
      index: true,
    },

    bulkSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountSet",
      default: null,
    },

    combinesWith: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },

    visibility: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// ✅ Unique per store
DiscountCodeSchema.index({ storeId: 1, code: 1 }, { unique: true });

export default mongoose.models.DiscountCode ||
  mongoose.model("DiscountCode", DiscountCodeSchema);
