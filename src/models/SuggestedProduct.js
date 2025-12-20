// models/SuggestedProduct.js

import mongoose from 'mongoose';

const SuggestedProductSchema = new mongoose.Schema(
  {
    shopifyProductId: {
      type: String,
      required: true,
      unique: true,
    },
    productHandle: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    featuredImageUrl: {
      type: String,
      default: '',
    },
    variantId: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
SuggestedProductSchema.index({ shopifyProductId: 1 });
SuggestedProductSchema.index({ isActive: 1, displayOrder: 1 });

// Prevent model recompilation in development
export default mongoose.models.SuggestedProduct || 
  mongoose.model('SuggestedProduct', SuggestedProductSchema);