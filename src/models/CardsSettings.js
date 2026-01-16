// models/C2PSettings.js
import mongoose from 'mongoose';

const c2pSettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true, // One config per store
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      // General
      showQRUpiOnConfirmation: false,

      // Timers (in minutes)
      confirmationExpirationTimer: 3,
      messageDelayTimer: 0,
      whatsappExpirationTimer: 16,
      expirationTime: 19,

      // Discount
      discountType: 'Fixed',
      discountValue: '',
      enableUpiDiscount: false,
      enableDiscountCapping: false,
      discountCapAmount: '',

      // WhatsApp
      cashToPrepaidWhatsapp: false,
      whatsappProvider: 'Gupshup',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
c2pSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for fast lookup by storeId
c2pSettingsSchema.index({ storeId: 1 });

export default mongoose.models.C2PSettings ||
  mongoose.model('C2PSettings', c2pSettingsSchema);