import mongoose from 'mongoose';

const storeUISettingsSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true, // One config per store
  },
  logo: { type: String, default: null },
  primaryColor: { type: String, default: '#F74435' },

  // Checkout Elements
  reviewsTrustBanner: { type: Boolean, default: false },
  disableDiscounts: { type: Boolean, default: false },
  confettiOnDiscount: { type: Boolean, default: true },
  exitPopupMode: { type: String, default: 'standard' }, // standard | capture
  exitCoupon: { type: Boolean, default: false },
  showMRPStrikethrough: { type: Boolean, default: true },
  showTaxes: { type: Boolean, default: false },
  showLineItemProperties: { type: Boolean, default: false },
  showVariantTitle: { type: Boolean, default: true },
  staticEDD: { type: Boolean, default: false },
  lineItemLogo: { type: String, default: null },
  eddTextColor: { type: String, default: '#000000' },
  enableGST: { type: Boolean, default: false },
  enableBillingAddress: { type: Boolean, default: false },

  // Login Tab
  displayBanner: { type: Boolean, default: true },
  bannerBgColor: { type: String, default: '#F74435' },
  bannerTextColor: { type: String, default: '#FFFFFF' },
  bannerText: { type: String, default: 'Over 6L+ Happy Customer | Shop with confidence' },
  ctaTextEnabled: { type: Boolean, default: true },
  ctaText: { type: String, default: 'More Discount' },
  autoSelectConsent: { type: Boolean, default: true },
  consentTextEnabled: { type: Boolean, default: true },
  consentText: { type: String, default: 'Shop Rs. 499/- & Get Free Shipping | Coupon Code - fship' },

  // Address Tab
  addressCtaEnabled: { type: Boolean, default: false },
  addressCtaText: { type: String, default: 'Shop Now' },
  makeEmailOptional: { type: Boolean, default: false },
  captureRecipientPhone: { type: Boolean, default: false },
  showAutoSuggestion: { type: Boolean, default: true },
  addAdditionalField: { type: Boolean, default: true },
  keepCityEditable: { type: Boolean, default: true },

  // Payments Tab
  paymentDisplayBanner: { type: Boolean, default: true },
  paymentBannerBgColor: { type: String, default: '#F74435' },
  paymentBannerTextColor: { type: String, default: '#FFFFFF' },
  paymentBannerText: { type: String, default: 'Prepaid No Fees + 5% discount | COD Rs.40 Extra + No Discount' },
}, {
  timestamps: true, // createdAt, updatedAt
});

export default mongoose.models.StoreUISettings || mongoose.model('StoreUISettings', storeUISettingsSchema);