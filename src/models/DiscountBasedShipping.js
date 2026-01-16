// models/DiscountBasedShipping.js
import mongoose from 'mongoose';

const RuleSchema = new mongoose.Schema({
  discountCode: { type: String, required: true, trim: true },
  matchType: {
    type: String,
    enum: ['Exact Match', 'Contains', 'Starts With'],
    required: true,
  },
  shippingCharge: { type: Number, required: true, min: 0 },
});

const DiscountBasedShippingSchema = new mongoose.Schema({
  storeId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  rules: [RuleSchema],
}, { timestamps: true });

export default mongoose.models.DiscountBasedShipping || mongoose.model('DiscountBasedShipping', DiscountBasedShippingSchema);