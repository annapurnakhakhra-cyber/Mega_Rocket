// src/models/PaymentPageSettings.js
import mongoose from 'mongoose';

const paymentPageSettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      showPrice: true,
      showComparedPrice: false,
      paymentPageTitle: '',
      showDecimalValue: true,
      paymentPageOfferCarousel: false,
      pageTitleColor: '#D61E1E',
      methodPageOfferCarousel: true,
      buttonBadgePosition: 'Center',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paymentPageSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

paymentPageSettingsSchema.index({ storeId: 1 });

export default mongoose.models.PaymentPageSettings ||
  mongoose.model('PaymentPageSettings', paymentPageSettingsSchema);