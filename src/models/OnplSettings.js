// models/OnplSettings.js
import mongoose from 'mongoose';

const onplSettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      pendingTimer: 10,
      failedTimer: 10,
      waiveCodCharges: false,
      enableCodTimer: true,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries by storeId
onplSettingsSchema.index({ storeId: 1 });

// Optional: If you ever use .save() instead of findOneAndUpdate, you can add this back
// But currently, it's not needed and can cause confusion
// onplSettingsSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.models.OnplSettings ||
  mongoose.model('OnplSettings', onplSettingsSchema);