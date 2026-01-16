// models/DiscountSettings.js
import mongoose from 'mongoose';

const DiscountSettingsSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: [true, 'Store ID is required'],
      unique: true,
      trim: true,
    },
    manualStackingEnabled: {
      type: Boolean,
      default: false,
    },
    manualStackingLimit: {
      type: Number,
      min: [1, 'Limit must be at least 1'],
      max: [5, 'Maximum limit is 5'],
      default: 5,
    },
    bundleDiscountStackingEnabled: {
      type: Boolean,
      default: true,
    },
    specificStackingEnabled: {
      type: Boolean,
      default: false,
    },
    specificStackingMatchType: {
      type: String,
      enum: ['exact', 'starts_with', 'ends_with', 'contains'],
      default: 'exact',
    },
    specificStackingCodes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DiscountSettings ||
  mongoose.model('DiscountSettings', DiscountSettingsSchema);