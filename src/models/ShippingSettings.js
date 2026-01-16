// models/ShippingSettings.js

import mongoose from 'mongoose';

const ShippingSettingsSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: [true, 'Store ID is required'],
      unique: true,
      trim: true,
      index: true, // Faster lookups by storeId (very important for multi-store)
    },
    priceBasis: {
      type: String,
      enum: {
        values: ['Discounted Price', 'Original Price'],
        message: 'priceBasis must be either "Discounted Price" or "Original Price"',
      },
      default: 'Discounted Price',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Optional: Add compound index if you ever query by other fields + storeId
// ShippingSettingsSchema.index({ storeId: 1 });

// Prevent overwriting model in Next.js dev mode (hot reloading)
export default mongoose.models.ShippingSettings ||
  mongoose.model('ShippingSettings', ShippingSettingsSchema);