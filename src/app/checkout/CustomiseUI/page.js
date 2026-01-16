'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomiseUI() {
  const [logo, setLogo] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#F74435');
  const [activeTab, setActiveTab] = useState('Brand');

  // Checkout Elements States
  const [reviewsTrustBanner, setReviewsTrustBanner] = useState(false);
  const [disableDiscounts, setDisableDiscounts] = useState(false);
  const [confettiOnDiscount, setConfettiOnDiscount] = useState(true);
  const [exitPopupMode, setExitPopupMode] = useState('standard');
  const [exitCoupon, setExitCoupon] = useState(false);
  const [showMRPStrikethrough, setShowMRPStrikethrough] = useState(true);
  const [showTaxes, setShowTaxes] = useState(false);
  const [showLineItemProperties, setShowLineItemProperties] = useState(false);
  const [showVariantTitle, setShowVariantTitle] = useState(true);
  const [staticEDD, setStaticEDD] = useState(false);
  const [lineItemLogo, setLineItemLogo] = useState(null);
  const [eddTextColor, setEddTextColor] = useState('#000000');
  const [enableGST, setEnableGST] = useState(false);
  const [enableBillingAddress, setEnableBillingAddress] = useState(false);

  // Login Tab States
  const [displayBanner, setDisplayBanner] = useState(true);
  const [bannerBgColor, setBannerBgColor] = useState('#F74435');
  const [bannerTextColor, setBannerTextColor] = useState('#FFFFFF');
  const [bannerText, setBannerText] = useState('Over 6L+ Happy Customer | Shop with confidence');
  const [ctaTextEnabled, setCtaTextEnabled] = useState(true);
  const [ctaText, setCtaText] = useState('More Discount');
  const [autoSelectConsent, setAutoSelectConsent] = useState(true);
  const [consentTextEnabled, setConsentTextEnabled] = useState(true);
  const [consentText, setConsentText] = useState('Shop Rs. 499/- & Get Free Shipping | Coupon Code - fship');

  // Address Tab States
  const [addressCtaEnabled, setAddressCtaEnabled] = useState(false);
  const [addressCtaText, setAddressCtaText] = useState('Shop Now');
  const [makeEmailOptional, setMakeEmailOptional] = useState(false);
  const [captureRecipientPhone, setCaptureRecipientPhone] = useState(false);
  const [showAutoSuggestion, setShowAutoSuggestion] = useState(true);
  const [addAdditionalField, setAddAdditionalField] = useState(true);
  const [keepCityEditable, setKeepCityEditable] = useState(true);

  // Coupons Tab State
  const [hasConfiguredCoupons, setHasConfiguredCoupons] = useState(false);

  // Payments Tab States
  const [paymentDisplayBanner, setPaymentDisplayBanner] = useState(true);
  const [paymentBannerBgColor, setPaymentBannerBgColor] = useState('#F74435');
  const [paymentBannerTextColor, setPaymentBannerTextColor] = useState('#FFFFFF');
  const [paymentBannerText, setPaymentBannerText] = useState('Prepaid No Fees + 5% discount | COD Rs.40 Extra + No Discount');

  // Loading & Save Status
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'success', 'error'
   const [user, setUser] = useState(null);

  const fileInputRef = useRef(null);
  const lineItemFileInputRef = useRef(null);
  const router = useRouter();

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        console.log("user data is", parsed);
      } catch (err) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const STORE_ID = user?.shopUrl;

  
  // CHANGE THIS TO YOUR ACTUAL STORE ID (make dynamic later, e.g., from context or URL)
  // const STORE_ID = 'swing-9926.myshopify.com';

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/checkout-ui?storeId=${STORE_ID}`);
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();

        // Safely update states only if the field exists in the response
        if (data.logo !== undefined) setLogo(data.logo);
        if (data.primaryColor) setPrimaryColor(data.primaryColor);

        if (data.reviewsTrustBanner !== undefined) setReviewsTrustBanner(data.reviewsTrustBanner);
        if (data.disableDiscounts !== undefined) setDisableDiscounts(data.disableDiscounts);
        if (data.confettiOnDiscount !== undefined) setConfettiOnDiscount(data.confettiOnDiscount);
        if (data.exitPopupMode) setExitPopupMode(data.exitPopupMode);
        if (data.exitCoupon !== undefined) setExitCoupon(data.exitCoupon);
        if (data.showMRPStrikethrough !== undefined) setShowMRPStrikethrough(data.showMRPStrikethrough);
        if (data.showTaxes !== undefined) setShowTaxes(data.showTaxes);
        if (data.showLineItemProperties !== undefined) setShowLineItemProperties(data.showLineItemProperties);
        if (data.showVariantTitle !== undefined) setShowVariantTitle(data.showVariantTitle);
        if (data.staticEDD !== undefined) setStaticEDD(data.staticEDD);
        if (data.lineItemLogo !== undefined) setLineItemLogo(data.lineItemLogo);
        if (data.eddTextColor) setEddTextColor(data.eddTextColor);
        if (data.enableGST !== undefined) setEnableGST(data.enableGST);
        if (data.enableBillingAddress !== undefined) setEnableBillingAddress(data.enableBillingAddress);

        // Login tab
        if (data.displayBanner !== undefined) setDisplayBanner(data.displayBanner);
        if (data.bannerBgColor) setBannerBgColor(data.bannerBgColor);
        if (data.bannerTextColor) setBannerTextColor(data.bannerTextColor);
        if (data.bannerText) setBannerText(data.bannerText);
        if (data.ctaTextEnabled !== undefined) setCtaTextEnabled(data.ctaTextEnabled);
        if (data.ctaText) setCtaText(data.ctaText);
        if (data.autoSelectConsent !== undefined) setAutoSelectConsent(data.autoSelectConsent);
        if (data.consentTextEnabled !== undefined) setConsentTextEnabled(data.consentTextEnabled);
        if (data.consentText) setConsentText(data.consentText);

        // Address tab
        if (data.addressCtaEnabled !== undefined) setAddressCtaEnabled(data.addressCtaEnabled);
        if (data.addressCtaText) setAddressCtaText(data.addressCtaText);
        if (data.makeEmailOptional !== undefined) setMakeEmailOptional(data.makeEmailOptional);
        if (data.captureRecipientPhone !== undefined) setCaptureRecipientPhone(data.captureRecipientPhone);
        if (data.showAutoSuggestion !== undefined) setShowAutoSuggestion(data.showAutoSuggestion);
        if (data.addAdditionalField !== undefined) setAddAdditionalField(data.addAdditionalField);
        if (data.keepCityEditable !== undefined) setKeepCityEditable(data.keepCityEditable);

        // Payments tab
        if (data.paymentDisplayBanner !== undefined) setPaymentDisplayBanner(data.paymentDisplayBanner);
        if (data.paymentBannerBgColor) setPaymentBannerBgColor(data.paymentBannerBgColor);
        if (data.paymentBannerTextColor) setPaymentBannerTextColor(data.paymentBannerTextColor);
        if (data.paymentBannerText) setPaymentBannerText(data.paymentBannerText);

      } catch (err) {
        console.error('Failed to load UI settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save all settings to the API
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const payload = {
        logo,
        primaryColor,

        reviewsTrustBanner,
        disableDiscounts,
        confettiOnDiscount,
        exitPopupMode,
        exitCoupon,
        showMRPStrikethrough,
        showTaxes,
        showLineItemProperties,
        showVariantTitle,
        staticEDD,
        lineItemLogo,
        eddTextColor,
        enableGST,
        enableBillingAddress,

        displayBanner,
        bannerBgColor,
        bannerTextColor,
        bannerText,
        ctaTextEnabled,
        ctaText,
        autoSelectConsent,
        consentTextEnabled,
        consentText,

        addressCtaEnabled,
        addressCtaText,
        makeEmailOptional,
        captureRecipientPhone,
        showAutoSuggestion,
        addAdditionalField,
        keepCityEditable,

        paymentDisplayBanner,
        paymentBannerBgColor,
        paymentBannerTextColor,
        paymentBannerText,
      };

      const res = await fetch(`/api/checkout-ui?storeId=${STORE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLineItemLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLineItemLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const triggerLineItemUpload = () => lineItemFileInputRef.current?.click();

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors cursor-pointer ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          {/* Preview Panel */}
          <div className="w-full lg:w-80 xl:w-96 bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-4 lg:self-start order-1 lg:order-2">
            <div className="bg-gray-100 px-3 sm:px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {logo ? (
                  <img src={logo} alt="Brand Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded" />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">Logo</span>
                  </div>
                )}
                <h3 className="font-semibold text-sm sm:text-base">Preview</h3>
              </div>
              <p className="text-xs flex items-center gap-1.5 text-green-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="hidden sm:inline">Mobile - {activeTab} - Pay</span>
                <span className="sm:hidden">Live</span>
              </p>
            </div>

            <div className="p-3 sm:p-4 lg:p-5 bg-gray-50 space-y-4">
              {activeTab === 'Coupons' && (
                <>
                  <div className="bg-green-50 rounded-lg px-4 py-3 flex items-center justify-between border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        ₹
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">HAIRBOX</p>
                        <p className="text-sm text-green-700">You Save ₹100</p>
                      </div>
                    </div>
                    <button className="text-green-700 font-medium text-sm underline cursor-pointer">Apply</button>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-blue-600">
                      5 coupons available <span className="font-semibold">View Coupons →</span>
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-300 px-4 py-3">
                    <input type="text" placeholder="Enter coupon code" className="w-full text-sm focus:outline-none" />
                  </div>

                  <div className="space-y-4">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>

                  <button
                    style={{ backgroundColor: primaryColor }}
                    className="w-full text-white font-semibold py-4 rounded-lg shadow-lg flex items-center cursor-pointer justify-center gap-2"
                  >
                    Continue →
                  </button>
                </>
              )}

              {activeTab === 'Address' && (
                <>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="font-semibold text-sm mb-4 text-gray-800">Shipping Address</p>
                    <div className="space-y-3">
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>

                    <button className="mt-4 w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium text-sm transition cursor-pointer">
                      + Add Address
                    </button>
                  </div>

                  <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="font-semibold text-sm mb-4 text-gray-800">Shipping methods</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded"></div>
                        <div>
                          <p className="font-medium text-sm">free</p>
                          <p className="text-xs text-gray-600">Free</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded"></div>
                        <div>
                          <p className="font-medium text-sm">paid</p>
                          <p className="text-xs text-gray-600">₹10</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    style={{ backgroundColor: primaryColor }}
                    className="mt-6 w-full text-white font-semibold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {addressCtaEnabled ? addressCtaText : 'Continue'} →
                  </button>

                  <div className="bg-gray-100 py-3 text-center text-xs text-gray-500 border-t border-gray-200 mt-6">
                    <div className="flex flex-wrap justify-center gap-3">
                      <span>Terms</span>
                      <span>Privacy</span>
                      <span>Secured</span>
                      <span>Payment</span>
                      <span className="font-bold text-blue-600">GoKwik</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Payments' && (
                <>
                  {paymentDisplayBanner && (
                    <div className="">
                      <div className="px-4 py-3 text-sm font-medium text-center text-white" style={{ backgroundColor: paymentBannerBgColor }}>
                        {paymentBannerText}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 mb-2">
                    <p className="text-sm font-medium text-gray-600 text-center uppercase">Payment Options</p>
                  </div>

                  <div className="space-y-3">
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                  </div>

                  <div className="bg-gray-100 py-3 text-center text-xs text-gray-500 border-t border-gray-200 mt-6">
                    <div className="flex flex-wrap justify-center gap-3">
                      <span>Terms</span>
                      <span>Privacy</span>
                      <span>Secured</span>
                      <span>Payment</span>
                      <span className="font-bold text-blue-600">GoKwik</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Login' && (
                <>
                  {displayBanner && (
                    <div className="rounded-lg px-4 py-3 text-center text-sm font-medium text-white" style={{ backgroundColor: bannerBgColor }}>
                      {bannerText}
                    </div>
                  )}

                  <div className="space-y-4 mt-4">
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>

                  {consentTextEnabled && (
                    <div className="bg-white rounded-lg px-4 py-4 border border-gray-200 text-center mt-4">
                      <p className="text-sm text-gray-800 mb-4">{consentText}</p>
                      <div className="flex items-center justify-center gap-2">
                        <input type="checkbox" checked={autoSelectConsent} readOnly className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-xs text-gray-600">I agree to receive offers</span>
                      </div>
                    </div>
                  )}

                  <button
                    style={{ backgroundColor: ctaTextEnabled ? '#000000' : primaryColor }}
                    className="mt-6 w-full text-white font-semibold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {ctaTextEnabled ? ctaText : 'Continue'} →
                  </button>

                  <div className="bg-gray-100 py-3 text-center text-xs text-gray-500 border-t border-gray-200 mt-4">
                    <div className="flex flex-wrap justify-center gap-3">
                      <span>Terms</span>
                      <span>Privacy</span>
                      <span>Secured</span>
                      <span>Payment</span>
                      <span className="font-bold text-blue-600">GoKwik</span>
                    </div>
                  </div>
                </>
              )}

              {['Brand', 'Checkout Elements'].includes(activeTab) && (
                <>
                  <div className="bg-gray-200 h-8 sm:h-10 rounded-lg"></div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                    <div className="flex gap-3 items-start">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 mb-2"></div>
                        <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-12 sm:w-14"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 bg-gray-300 rounded-lg"></div>
                    ))}
                  </div>
                  <button style={{ backgroundColor: primaryColor }} className="w-full text-white font-semibold py-4 rounded-lg shadow-lg cursor-pointer">
                    Continue →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="flex-1 bg-white rounded-xl lg:rounded-2xl shadow-sm order-2 lg:order-1">
            <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-full sm:w-auto">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2 sm:gap-3">
                    Customise UI
                    {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">Open Guide</span> */}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
                    This section enables you to customise UI for checkout, add banners, enable step specific features and more.
                  </p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-5 sm:px-6 py-2.5 rounded-lg sm:rounded-[10px] text-sm sm:text-base font-medium shadow transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : saveStatus === 'success' ? (
                    <>✓ Saved!</>
                  ) : saveStatus === 'error' ? (
                    <>Failed</>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>

              <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-2 scrollbar-hide">
                  {['Brand', 'Checkout Elements', 'Login', 'Address', 'Coupons', 'Payments'].map((tab) => (
                    <div key={tab} className="relative whitespace-nowrap flex-shrink-0">
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${tab === activeTab ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        {tab}
                      </button>
                      {tab === activeTab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Brand Tab */}
              {activeTab === 'Brand' && (
                <>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Brand</h2>
                    {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Open Guide</span> */}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Control Checkout UI to reflect your brand theme and styling.</p>

                  <div className="mb-10 sm:mb-12">
                    <h3 className="font-medium text-sm sm:text-base mb-2">Logo</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Upload your brand logo to be visible on GoKwik checkout.</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-dashed border-gray-300 flex flex-col items-center">
                      {logo ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center">
                          <img src={logo} alt="Brand Logo" className="w-28 h-20 sm:w-32 sm:h-24 object-contain rounded-lg shadow-md border border-gray-200" />
                          <button onClick={triggerUpload} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg sm:rounded-[10px] text-sm sm:text-base font-medium flex items-center justify-center gap-2 transition shadow cursor-pointer">
                            <span>+</span> Upload Logo
                          </button>
                        </div>
                      ) : (
                        <button onClick={triggerUpload} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-[10px] text-base sm:text-lg font-medium flex items-center justify-center gap-2 sm:gap-3 transition shadow-lg cursor-pointer">
                          <span className="text-xl sm:text-2xl">+</span> Upload Logo
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm sm:text-base mb-2">Theme</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">Control checkout theme colour and font colour on main CTAs.</p>
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <span className="font-medium text-gray-700 text-sm sm:text-base">Primary Color</span>
                        <div className="flex items-center gap-3">
                          <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 sm:w-14 sm:h-14 rounded cursor-pointer border-2 border-gray-400" />
                          <span className="text-sm sm:text-base text-gray-600 font-mono">{primaryColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Checkout Elements Tab */}
              {activeTab === 'Checkout Elements' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Checkout Elements</h2>
                    {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Open Guide</span> */}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    Control checkout UI related elements like order summary, exit pop-up and more.
                  </p>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm sm:text-base mb-1">Reviews / Trust Banner</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-block">+Recommended</span>
                      </div>
                      <Toggle checked={reviewsTrustBanner} onChange={() => setReviewsTrustBanner(!reviewsTrustBanner)} />
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mt-3">Enable Review/Trust Banner at Login page</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm sm:text-base mb-1">Discount Application</h3>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full inline-block">Not Recommended</span>
                      </div>
                      <Toggle checked={disableDiscounts} onChange={() => setDisableDiscounts(!disableDiscounts)} />
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mt-3 mb-4">
                      Disable discounts application on checkout. Enabling this blocks all manual coupon codes.
                    </p>
                    <div className="flex items-start justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm sm:text-base">Show confetti on discount application</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">Enhance customer experience on successful discount application.</p>
                      </div>
                      <Toggle checked={confettiOnDiscount} onChange={() => setConfettiOnDiscount(!confettiOnDiscount)} />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="font-medium text-sm sm:text-base mb-4">Exit Popup</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="radio" name="exitPopup" checked={exitPopupMode === 'standard'} onChange={() => setExitPopupMode('standard')} className="mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base">Show a standard exit popup</div>
                          <p className="text-gray-600 text-xs sm:text-sm mt-1">Show an exit confirmation with applied discounts or free gifts.</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="radio" name="exitPopup" checked={exitPopupMode === 'capture'} onChange={() => setExitPopupMode('capture')} className="mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-sm sm:text-base">Capture reasons for exiting</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+Recommended</span>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">Customers respond from a list of reasons (shown in analytics).</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm sm:text-base">Exit Coupon on Checkout</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mt-2">
                          Configure a discount visible on exit popup when user tries to exit checkout.
                        </p>
                      </div>
                      <Toggle checked={exitCoupon} onChange={() => setExitCoupon(!exitCoupon)} />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <h3 className="text-base sm:text-lg font-semibold">Order Summary Settings</h3>
                      <button className="text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition cursor-pointer whitespace-nowrap">
                        Configure Tax Settings
                      </button>
                    </div>
                    <div className="space-y-4 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base flex flex-wrap items-center gap-2 mb-1">
                            Show MRP with strikethrough
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+Recommended</span>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Show discounts on MRP and slashed price in order summary.
                          </p>
                        </div>
                        <Toggle checked={showMRPStrikethrough} onChange={() => setShowMRPStrikethrough(!showMRPStrikethrough)} />
                      </div>

                      <div className="flex items-start justify-between gap-3 pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base mb-1">Show Taxes on order summary</div>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Show tax breakup in order summary (inclusive or exclusive).
                          </p>
                        </div>
                        <Toggle checked={showTaxes} onChange={() => setShowTaxes(!showTaxes)} />
                      </div>

                      <div className="flex items-start justify-between gap-3 pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base mb-1">Show line item properties</div>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Show line item properties on Order Summary to customers.
                          </p>
                        </div>
                        <Toggle checked={showLineItemProperties} onChange={() => setShowLineItemProperties(!showLineItemProperties)} />
                      </div>

                      <div className="flex items-start justify-between gap-3 pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base mb-1">Show Variant Title</div>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Enable to show variant title in Order Summary
                          </p>
                        </div>
                        <Toggle checked={showVariantTitle} onChange={() => setShowVariantTitle(!showVariantTitle)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Static EDD</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-medium text-sm sm:text-base">Show Static EDD</span>
                          <button className="text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap">
                            Configure 3rd Party Edd
                          </button>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">Enable to show static edd on checkout</p>
                      </div>
                      <Toggle checked={staticEDD} onChange={() => setStaticEDD(!staticEDD)} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3">Line Item Level Edd</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">Upload line item level logo for GoKwik checkout.</p>
                    <input ref={lineItemFileInputRef} type="file" accept="image/*" onChange={handleLineItemLogoUpload} className="hidden" />
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                      <button onClick={triggerLineItemUpload} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-[10px] font-medium transition shadow cursor-pointer">
                        Upload Logo
                      </button>
                      <div className="w-20 h-20 bg-white border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center">
                        {lineItemLogo ? (
                          <img src={lineItemLogo} alt="Line Item Logo" className="w-full h-full object-contain rounded" />
                        ) : (
                          <span className="text-2xl text-gray-400">📷</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm sm:text-base block mb-3">Text Color (optional)</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={eddTextColor} onChange={(e) => setEddTextColor(e.target.value)} className="w-12 h-12 sm:w-14 sm:h-14 rounded cursor-pointer border-2 border-gray-400" />
                        <span className="font-mono text-sm sm:text-base text-gray-700">{eddTextColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Enable GST</div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Capture GST details</div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            GST details verified with government data and passed to Shopify orders.
                          </p>
                        </div>
                        <Toggle checked={enableGST} onChange={() => setEnableGST(!enableGST)} />
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Enable Billing Address</div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Capture Billing details</div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Users get an option to add separate Billing Address passed to Shopify.
                          </p>
                        </div>
                        <Toggle checked={enableBillingAddress} onChange={() => setEnableBillingAddress(!enableBillingAddress)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Tab */}
              {activeTab === 'Login' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Login</h2>
                    {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Open Guide</span> */}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    Control login step UI on checkout - add banners, control CTA text and more.
                  </p>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-medium text-sm sm:text-base">Banner</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+Recommended</span>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Display an announcement banner to customers on login step
                        </p>
                      </div>
                      <Toggle checked={displayBanner} onChange={() => setDisplayBanner(!displayBanner)} />
                    </div>

                    {displayBanner && (
                      <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="font-medium text-sm sm:text-base block mb-3">Background Color</label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={bannerBgColor} onChange={(e) => setBannerBgColor(e.target.value)} className="w-10 h-10 sm:w-12 sm:h-12 rounded cursor-pointer border-2 border-gray-400" />
                              <span className="font-mono text-xs sm:text-sm text-gray-700">{bannerBgColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-medium text-sm sm:text-base block mb-3">Text Color</label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={bannerTextColor} onChange={(e) => setBannerTextColor(e.target.value)} className="w-10 h-10 sm:w-12 sm:h-12 rounded cursor-pointer border-2 border-gray-400" />
                              <span className="font-mono text-xs sm:text-sm text-gray-700">{bannerTextColor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                          <span className="text-blue-600 text-lg sm:text-xl flex-shrink-0">ℹ</span>
                          <p className="text-xs sm:text-sm text-blue-900">A maximum of 3 banners can be configured</p>
                        </div>

                        <div>
                          <div className="border border-gray-300 rounded-t-lg bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 flex gap-3 sm:gap-4">
                            <button className="font-bold text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">B</button>
                            <button className="italic text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">I</button>
                            <button className="underline text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">U</button>
                            <button className="text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">🔗</button>
                          </div>
                          <div className="border border-gray-300 border-t-0 rounded-b-lg">
                            <textarea
                              value={bannerText}
                              onChange={(e) => setBannerText(e.target.value.slice(0, 64))}
                              className="w-full p-3 sm:p-4 min-h-24 sm:min-h-32 resize-none focus:outline-none text-sm sm:text-base bg-white"
                              placeholder="Enter banner text..."
                            />
                            <div className="text-right px-3 sm:px-4 pb-2 sm:pb-3 text-xs sm:text-sm text-gray-500">
                              {bannerText.length}/64
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 text-center">
                          <button className="text-blue-600 font-medium text-sm sm:text-base hover:underline cursor-pointer">
                            Add Another +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm sm:text-base mb-2 cursor-pointer">Primary Button</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Control the text shown on main CTA button on login step.
                        </p>
                      </div>
                      <Toggle checked={ctaTextEnabled} onChange={() => setCtaTextEnabled(!ctaTextEnabled)} />
                    </div>

                    {ctaTextEnabled && (
                      <div className="mt-4 relative">
                        <input
                          type="text"
                          value={ctaText}
                          onChange={(e) => setCtaText(e.target.value.slice(0, 15))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          placeholder="Enter CTA text"
                        />
                        <div className="absolute right-3 sm:right-4 top-2.5 sm:top-3 text-xs sm:text-sm text-gray-500">
                          {ctaText.length}/15
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="font-medium text-sm sm:text-base mb-6">Consent Section</h3>

                    <div className="flex items-start justify-between gap-3 mb-6 pb-6 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base mb-1">Auto-select offers consent box</p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Pre-select the consent box for offers and updates on login page
                        </p>
                      </div>
                      <Toggle checked={autoSelectConsent} onChange={() => setAutoSelectConsent(!autoSelectConsent)} />
                    </div>

                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base mb-1">Consent Section Text</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Control text displayed on consent section box</p>
                      </div>
                      <Toggle checked={consentTextEnabled} onChange={() => setConsentTextEnabled(!consentTextEnabled)} />
                    </div>

                    {consentTextEnabled && (
                      <div className="mt-4">
                        <div className="border border-gray-300 rounded-t-lg bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 flex gap-3 sm:gap-4">
                          <button className="font-bold text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">B</button>
                          <button className="italic text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">I</button>
                          <button className="underline text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">U</button>
                          <button className="text-base sm:text-lg hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">🔗</button>
                        </div>
                        <div className="border border-gray-300 border-t-0 rounded-b-lg">
                          <textarea
                            value={consentText}
                            onChange={(e) => setConsentText(e.target.value.slice(0, 256))}
                            className="w-full p-3 sm:p-4 min-h-24 sm:min-h-32 resize-none focus:outline-none text-sm sm:text-base bg-white"
                            placeholder="Enter consent section text..."
                          />
                          <div className="text-right px-3 sm:px-4 pb-2 sm:pb-3 text-xs sm:text-sm text-gray-500">
                            {consentText.length}/256
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'Address' && (
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Address</h2>
                    {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Open Guide</span> */}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-8">
                    Control address step related UI and features on checkout - add banners, control address fields and more.
                  </p>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm sm:text-base mb-2">Primary Button</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Control the text to shown on main CTA button on address step.
                        </p>
                      </div>
                      <Toggle checked={addressCtaEnabled} onChange={() => setAddressCtaEnabled(!addressCtaEnabled)} />
                    </div>
                    {addressCtaEnabled && (
                      <div className="mt-4">
                        <input
                          type="text"
                          value={addressCtaText}
                          onChange={(e) => setAddressCtaText(e.target.value.slice(0, 20))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          placeholder="Enter CTA text"
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {addressCtaText.length}/20
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-6">Address Settings</h3>
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-sm sm:text-base">Make Email ID Optional</p>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Not Recommended</span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Make email ID field non-mandatory on address step. Pls note: We pass(phone_number)@dummy.com on Shopify to create customers.
                            </p>
                          </div>
                          <Toggle checked={makeEmailOptional} onChange={() => setMakeEmailOptional(!makeEmailOptional)} />
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base mb-2">Capture recipient phone number on address</p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Enabling this feature allows customers to add a recipient phone number which gets passed as part of shipping address on orders.
                            </p>
                          </div>
                          <Toggle checked={captureRecipientPhone} onChange={() => setCaptureRecipientPhone(!captureRecipientPhone)} />
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-sm sm:text-base">Show Auto-Suggestion of addresses (Powered by GoKwik)</p>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+New</span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Enabling this feature will show auto-suggested new address addition on checkout. This is powered by GoKwik's self developed address suggestion model.
                            </p>
                          </div>
                          <Toggle checked={showAutoSuggestion} onChange={() => setShowAutoSuggestion(!showAutoSuggestion)} />
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base mb-2">Add an additional Address Field</p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Enabling this feature allows customers to add additional address details like landmark etc in an optional field on Checkout.
                            </p>
                          </div>
                          <Toggle checked={addAdditionalField} onChange={() => setAddAdditionalField(!addAdditionalField)} />
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base mb-2">Keep City Editable</p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Disabling this config will ensure that users can't edit City Name after entering PIN Code.
                            </p>
                          </div>
                          <Toggle checked={keepCityEditable} onChange={() => setKeepCityEditable(!keepCityEditable)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === 'Coupons' && (
                <div className="flex flex-col items-center justify-center min-h-96 text-center px-6">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">Oooops!</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-lg">
                    You have not configured any discounts on checkout to be visible yet.
                  </p>
                  <button 
                  onClick={() => router.push('/checkout/Discount')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition cursor-pointer">
                    Configure Now
                  </button>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'Payments' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Payments</h2>
                    {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Open Guide</span> */}
                  </div>
                  <p className="text-gray-600">
                    Control payment step UI on checkout - add banners, control CTA text and more.
                  </p>

                  {/* Banner Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">Banner</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+Recommended</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Enable this to display an announcement banner to the customers on payment step of checkout
                        </p>
                      </div>
                      <Toggle checked={paymentDisplayBanner} onChange={() => setPaymentDisplayBanner(!paymentDisplayBanner)} />
                    </div>

                    {paymentDisplayBanner && (
                      <div className="mt-8 space-y-6">
                        {/* Color Pickers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-medium mb-3">Background Color</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={paymentBannerBgColor}
                                onChange={(e) => setPaymentBannerBgColor(e.target.value)}
                                className="w-12 h-12 rounded cursor-pointer border-2 border-gray-400"
                              />
                              <span className="font-mono text-sm text-gray-700">{paymentBannerBgColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block font-medium mb-3">Text Color</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={paymentBannerTextColor}
                                onChange={(e) => setPaymentBannerTextColor(e.target.value)}
                                className="w-12 h-12 rounded cursor-pointer border-2 border-gray-400"
                              />
                              <span className="font-mono text-sm text-gray-700">{paymentBannerTextColor}</span>
                            </div>
                          </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                          <span className="text-blue-600 text-xl">ℹ</span>
                          <p className="text-sm text-blue-900">A maximum of 3 banners can be configured</p>
                        </div>

                        {/* Text Editor */}
                        <div>
                          <div className="border border-gray-300 rounded-t-lg bg-gray-100 px-4 py-3 flex gap-4">
                            <button className="font-bold hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">B</button>
                            <button className="italic hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">I</button>
                            <button className="underline hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">U</button>
                            <button className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">🔗</button>
                          </div>
                          <div className="border border-gray-300 border-t-0 rounded-b-lg">
                            <textarea
                              value={paymentBannerText}
                              onChange={(e) => setPaymentBannerText(e.target.value.slice(0, 64))}
                              className="w-full p-4 min-h-32 resize-none focus:outline-none text-sm bg-white"
                              placeholder="Prepaid No Fees + 5% discount | COD Rs.40 Extra + No Discount"
                            />
                            <div className="text-right px-4 pb-3 text-sm text-gray-500">
                              {paymentBannerText.length}/64
                            </div>
                          </div>
                        </div>

                        {/* Add Another */}
                        <div className="border-t border-dashed border-gray-300 pt-4 text-center">
                          <button className="text-blue-600 font-medium hover:underline cursor-pointer">
                            Add Another +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payments UI Section */}
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base sm:text-lg font-semibold">Payments UI</h3>

                      <button
                      onClick={() => router.push('/payment/paymentconfigs')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 transition cursor-pointer">
                        <span className="text-lg">🔒</span>
                        Payments Control
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}