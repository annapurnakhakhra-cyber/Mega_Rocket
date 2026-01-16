import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: [true, "Store ID is required"],
      trim: true,
      index: true,
    },

    code: {
      type: String,
      // required: [true, "Discount code is required"],
      trim: true,
      uppercase: true,
    },

    
    type: {
      type: String,
      enum: ["manual", "automatic", "bulk"],
      // required: [true, "Type (manual / automatic / bulk) is required"],
      index: true,
    },

    
    bulkSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountSet",
      index: true,
      default: null,
    },

    combinesWith: {
      type: Boolean,
      default: true, 
    },

    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
      index: true,
    },

    visibility: {
      type: Boolean,
      default: false, 
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    shopifyDiscountId: {
      type: String,
      sparse: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

DiscountCodeSchema.index({ storeId: 1, code: 1 }, { unique: true });

DiscountCodeSchema.index({ storeId: 1, type: 1, status: 1 });
DiscountCodeSchema.index({ storeId: 1, visibility: 1 });
DiscountCodeSchema.index({ bulkSetId: 1 });

export default mongoose.models.DiscountCode ||
  mongoose.model("DiscountCode", DiscountCodeSchema);
