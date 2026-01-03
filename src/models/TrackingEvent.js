// 1. Database Model: models/TrackingEvent.js (New file - Create this)
import mongoose from 'mongoose';

const trackingEventSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // e.g., 'recovery_click', 'custom_abandonment'
  cartId: { type: String, required: true },
  customerName: String,
  email: String,
  totalValue: Number,
  timestamp: { type: Date, default: Date.now },
  recoveryUrl: String,
  action: String, // e.g., 'recovery_link_clicked'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // From JWT
  success: { type: Boolean, default: true },
  metadata: { type: mongoose.Schema.Types.Mixed } // Extra data like items, lastStep
}, { timestamps: true });

export default mongoose.models.TrackingEvent || mongoose.model('TrackingEvent', trackingEventSchema);