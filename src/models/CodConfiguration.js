// models/CodConfiguration.js
import mongoose from 'mongoose';

const CodConfigurationSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true, // One config per store/shop
  },

  // COD Settings
  codButtonTitle: { type: String, default: 'Cash on Delivery' },
  codButtonSubtext: { type: String, default: '' },
  codButtonColor: { type: String, default: '#F74435' },
  codButtonTextColor: { type: String, default: '#FFFFFF' },
  codBadgeText: { type: String, default: '' },
  codBadgeColor: { type: String, default: '#F73536' },
  codBadgeTextColor: { type: String, default: '#FFFFFF' },
  minCodOrderValue: { type: Number, default: 0 },
  maxCodOrderValue: { type: Number, default: 1500 },
  codOtpRequirement: { type: Boolean, default: false },

  // Partial COD Settings
  enablePpcod: { type: Boolean, default: false },
  ppcodButtonTitle: { type: String, default: 'Cash on Delivery' },
  ppcodButtonSubtext: { type: String, default: 'Amount Non-Refundable' },
  ppcodButtonColor: { type: String, default: '#F74435' },
  ppcodButtonTextColor: { type: String, default: '#FFFFFF' },
  ppcodBadgeText: { type: String, default: '' },
  ppcodBadgeColor: { type: String, default: '#03B696' },
  ppcodBadgeTextColor: { type: String, default: '#FFFFFF' },
  fixedPpcodAmount: { type: Number, default: 0 },
  tagBasedPpcodActivation: { type: Boolean, default: false },
  ppcodDeductionType: { type: String, enum: ['Fixed', 'Percentage'], default: 'Fixed' },
}, {
  timestamps: true,
});

export default mongoose.models.CodConfiguration || mongoose.model('CodConfiguration', CodConfigurationSchema);