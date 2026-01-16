// models/PaymentOffer.js
import mongoose from 'mongoose';

const paymentOfferSchema = new mongoose.Schema({
  shopId: {
    type: String,
    required: true,
  },

  // === Basic Details (Step 0) ===
  discountCode: { type: String, required: true },
  offerName: { type: String, required: true },
  offerTitle: { type: String, default: '' },
  offerSubtitle: { type: String, default: '' },
  offerDescription: { type: String, default: '' },
  termsConditions: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  viewInListing: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  isPartnerOffer: { type: Boolean, default: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  // === Conditions (Step 1) ===
  discountType: { type: String, enum: ['Fixed', 'Percentage'], default: 'Fixed' },
  discountAmount: { type: String, required: true }, // e.g., "1000"
  maxTotalUsage: { type: String, default: '10000' },
  maxPerCustomer: { type: String, default: '' },
  minCartValue: { type: String, default: '10000' },
  maxCartValue: { type: String, default: '100000' },
  skuRestriction: { type: String, enum: ['Yes', 'No'], default: 'Yes' },

  // === Applicable On (Step 2) ===
  selectedPaymentMethod: { type: String, default: '' },
  methodOfApplication: { type: String, enum: ['Coupon Based', 'Auto Apply'], default: 'Coupon Based' },

  // Status
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, {
  timestamps: true,
});

export default mongoose.models.PaymentOffer || mongoose.model('PaymentOffer', paymentOfferSchema);