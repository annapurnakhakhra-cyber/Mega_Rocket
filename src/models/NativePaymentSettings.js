// src/models/NativePaymentSettings.js
import mongoose from 'mongoose';

const nativePaymentSettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      buttonTitle: 'Other Payment Methods',
      buttonSubtext: '',
      buttonColor: '#F74435',
      buttonTextColor: '#FFFFFF',
      buttonBadgeText: '',
      buttonBadgeColor: '#03B696',
      buttonBadgeTextColor: '#FFFFFF',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

nativePaymentSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

nativePaymentSettingsSchema.index({ storeId: 1 });

export default mongoose.models.NativePaymentSettings ||
  mongoose.model('NativePaymentSettings', nativePaymentSettingsSchema); 