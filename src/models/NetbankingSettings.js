import mongoose from 'mongoose';

const netbankingSettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      buttonTitle: 'Netbanking',
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

netbankingSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

netbankingSettingsSchema.index({ storeId: 1 });

export default mongoose.models.NetbankingSettings ||
  mongoose.model('NetbankingSettings', netbankingSettingsSchema);