// models/PaymentConfig.js
import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  // You can later add: color, label, badge, etc.
});

const paymentConfigSchema = new mongoose.Schema({
  shopId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    features: {
      onplEnabled: { type: Boolean, default: false },
      c2pEnabled: { type: Boolean, default: false },
      recommendedEnabled: { type: Boolean, default: false },
    },
    methodUiStyle: {
      type: String,
      enum: ['default', 'minimal', 'accordion'],
      default: 'default',
    },
    paymentMethods: {
      cod: paymentMethodSchema,
      upi: paymentMethodSchema,
      cards: paymentMethodSchema,
      wallets: paymentMethodSchema,
      netbanking: paymentMethodSchema,
      native: paymentMethodSchema,
    },
  },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.models.PaymentConfig || mongoose.model('PaymentConfig', paymentConfigSchema);