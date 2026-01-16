import mongoose from "mongoose";

/**
 * 🔹 Tiered Discount Sub-Schema
 */
const TieredDiscountSchema = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    discountCode: {
      type: String,
      required: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["NON_FREEBIE", "FREEBIE"],
      default: "NON_FREEBIE",
    },

    lowerLimit: {
      type: Number,
      required: true,
      min: 0,
    },

    upperLimit: {
      type: Number,
      default: null,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    freebies: {
      type: String,
      default: "NA",
    },

    rtoDriven: {
      type: Boolean,
      default: false,
    },

    capping: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

/**
 * 🔹 Main COD Settings Schema
 */
const CodSettingsSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    codLimits: {
      lowerLimit: {
        type: Number,
        default: 0,
        min: 0,
      },
      upperLimit: {
        type: Number,
        default: 1500,
        min: 0,
      },
    },

    tiered: {
      enabled: {
        type: Boolean,
        default: true,
      },
      discounts: {
        type: [TieredDiscountSchema],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CodSettings ||
  mongoose.model("CodSettings", CodSettingsSchema);
