// models/ValueBasedShippingRule.js

import mongoose from 'mongoose';

const ValueBasedShippingRuleSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: [true, 'Store ID is required'],
      trim: true,
      index: true, // Fast lookup per store
    },
    name: {
      type: String,
      required: [true, 'Shipping name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Shipping price is required'],
      min: [0, 'Price cannot be negative'],
    },
    minOrderValue: {
      type: Number,
      default: null, // null = no minimum
    },
    maxOrderValue: {
      type: Number,
      default: null, // null = no maximum (shown as "NA")
    },
    // Advanced optional conditions
    paymentMethods: [
      {
        type: String,
        enum: ['UPI', 'COD', 'ALL'],
      },
    ],
    pinCodes: [String],
    customerCohorts: [String],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Compound index for common queries (store + active rules)
ValueBasedShippingRuleSchema.index({ storeId: 1, active: 1 });

export default mongoose.models.ValueBasedShippingRule ||
  mongoose.model('ValueBasedShippingRule', ValueBasedShippingRuleSchema);