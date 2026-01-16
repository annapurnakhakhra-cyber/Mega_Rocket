// src/models/C2PSettings.js
import mongoose from 'mongoose';

const c2pSettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      showQRUpiOnConfirmation: false,
      confirmationExpirationTimer: 3,
      messageDelayTimer: 0,
      whatsappExpirationTimer: 16,
      expirationTime: 19,
      discountType: 'Fixed',
      discountValue: '',
      enableUpiDiscount: false,
      enableDiscountCapping: false,
      discountCapAmount: '',
      cashToPrepaidWhatsapp: false,
      whatsappProvider: 'Gupshup',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

c2pSettingsSchema.index({ storeId: 1 });

export default mongoose.models.C2PSettings || 
  mongoose.model('C2PSettings', c2pSettingsSchema);