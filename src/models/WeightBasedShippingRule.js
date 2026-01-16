// models/WeightBasedShippingRule.js

import mongoose from 'mongoose';

const WeightBasedShippingRuleSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      required: [true, 'Store ID is required'],
      trim: true,
      index: true, // Fast queries per store
    },
    name: {
      type: String,
      required: [true, 'Shipping name is required'],
      trim: true,
    },
    minWeight: {
      type: Number,
      required: [true, 'Minimum weight is required'],
      min: [0, 'Weight cannot be negative'],
    },
    maxWeight: {
      type: Number,
      required: [true, 'Maximum weight is required'],
      min: [0, 'Weight cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Shipping price is required'],
      min: [0, 'Price cannot be negative'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: minWeight should be less than maxWeight
WeightBasedShippingRuleSchema.pre('save', async function () {
  if (this.minWeight >= this.maxWeight) {
    throw new Error('minWeight must be less than maxWeight');
  }
});

// Index for efficient range queries
WeightBasedShippingRuleSchema.index({ storeId: 1, minWeight: 1, maxWeight: 1 });

export default mongoose.models.WeightBasedShippingRule ||
  mongoose.model('WeightBasedShippingRule', WeightBasedShippingRuleSchema);